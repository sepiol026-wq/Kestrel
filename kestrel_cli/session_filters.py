# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Shared time/filter parsing for `kestrel sessions prune` / `archive`."""

from __future__ import annotations

import re
import time
from datetime import datetime, timezone, UTC
from typing import Any, Dict, Optional

from kestrel_cli.timefmt import coerce_epoch

_DURATION_RE = re.compile(
    r"^(\d+(?:\.\d+)?)\s*"
    r"(s|sec|secs|second|seconds|"
    r"m|min|mins|minute|minutes|"
    r"h|hr|hrs|hour|hours|"
    r"d|day|days|"
    r"w|wk|wks|week|weeks)$"
)

_UNIT_SECONDS = {"s": 1, "m": 60, "h": 3600, "d": 86400, "w": 604800}


def parse_duration_seconds(value: str) -> Optional[float]:
    """Parse ``5h`` / ``30m`` / ``2d`` / ``1w`` / ``90`` (bare = days, backward compatible with
    ``--older-than 90``) into seconds. Returns None when the value doesn't look like a duration."""
    s = str(value).strip().lower()
    if re.fullmatch(r"\d+(?:\.\d+)?", s):
        return float(s) * 86400
    m = _DURATION_RE.match(s)
    return None if not m else float(m.group(1)) * _UNIT_SECONDS[m.group(2)[0]]


def parse_point_in_time(value: str, flag: str) -> float:
    """Parse a CLI time value into an epoch timestamp.

    Durations mean "that long ago" (``5h`` = now minus 5 hours); ISO timestamps are taken as-is
    (naive = local time). Raises ``ValueError`` with a user-facing message on bad input.
    """
    s = str(value).strip()
    dur = parse_duration_seconds(s)
    if dur is not None:
        return time.time() - dur
    try:
        dt = datetime.fromisoformat(s)
    except ValueError:
        raise ValueError(
            f"Invalid value for {flag}: '{value}'. Use a duration like '5h', "
            f"'30m', '2d', '1w', a bare number of days, or an ISO timestamp "
            f"like '2026-07-05' or '2026-07-05 14:30'."
        ) from None
    return dt.timestamp() if dt.tzinfo is None else dt.astimezone(UTC).timestamp()


def format_epoch(ts: Optional[float]) -> str:
    """Render an epoch timestamp as a short local-time string; ``-`` when unset or corrupt."""
    return "-" if (ts := coerce_epoch(ts)) is None else datetime.fromtimestamp(ts).strftime("%Y-%m-%d %H:%M")


# (filter key, argparse attr, CLI flag, description template) for the four epoch bounds.
_TIME_BOUNDS = (
    ("last_active_before", "older_than", "--older-than", "last active before {v}"),
    ("last_active_after", "newer_than", "--newer-than", "last active after {v}"),
    ("started_before", "before", "--before", "started before {v}"),
    ("started_after", "after", "--after", "started after {v}"),
)
# (lower key, upper key, window label, lower flag, upper flag); checked in this order.
_WINDOWS = (
    ("started_after", "started_before", "start-time", "--after", "--before"),
    ("last_active_after", "last_active_before", "activity", "--newer-than", "--older-than"),
)
# (filter key, argparse attr, description template) for pass-through filters, in describe order.
# Numeric (min_/max_) filters are described when not None, text filters only when truthy.
_ARG_FILTERS = (
    ("source", "source", "source '{v}'"),
    ("title_like", "title", "title contains '{v}'"),
    ("end_reason", "end_reason", "end reason '{v}'"),
    ("cwd_prefix", "cwd", "cwd under '{v}'"),
    ("min_messages", "min_messages", ">= {v} messages"),
    ("max_messages", "max_messages", "<= {v} messages"),
    ("model_like", "model", "model contains '{v}'"),
    ("provider", "provider", "provider '{v}'"),
    ("user_id", "user", "user '{v}'"),
    ("chat_id", "chat_id", "chat '{v}'"),
    ("chat_type", "chat_type", "chat type '{v}'"),
    ("branch_like", "branch", "git branch contains '{v}'"),
    ("min_tokens", "min_tokens", ">= {v} tokens"),
    ("max_tokens", "max_tokens", "<= {v} tokens"),
    ("min_cost", "min_cost", ">= ${v}"),
    ("max_cost", "max_cost", "<= ${v}"),
    ("min_tool_calls", "min_tool_calls", ">= {v} tool calls"),
    ("max_tool_calls", "max_tool_calls", "<= {v} tool calls"),
)


def build_prune_filters(args: Any) -> dict[str, Any]:
    """Translate argparse Namespace flags into SessionDB filter kwargs.

    ``--older-than`` / ``--newer-than`` bound last activity (freshest of ``last_activity_at`` /
    latest message / ``started_at``); ``--before`` / ``--after`` bound session start time.
    """
    last_active_before: Optional[float] = None
    last_active_after: Optional[float] = None
    started_before: Optional[float] = None
    started_after: Optional[float] = None

    def _tighter(current: Optional[float], new: float, upper: bool) -> float:
        if current is None:
            return new
        return min(current, new) if upper else max(current, new)

    older_than = getattr(args, "older_than", None)
    if older_than is not None:
        last_active_before = _tighter(
            last_active_before,
            parse_point_in_time(older_than, "--older-than"),
            True,
        )
    newer_than = getattr(args, "newer_than", None)
    if newer_than is not None:
        last_active_after = _tighter(
            last_active_after,
            parse_point_in_time(newer_than, "--newer-than"),
            False,
        )
    before = getattr(args, "before", None)
    if before is not None:
        started_before = _tighter(
            started_before, parse_point_in_time(before, "--before"), True
        )
    after = getattr(args, "after", None)
    if after is not None:
        started_after = _tighter(
            started_after, parse_point_in_time(after, "--after"), False
        )

    if (
        started_before is not None
        and started_after is not None
        and started_after >= started_before
    ):
        raise ValueError(
            "Empty start-time window: the --after bound "
            f"({format_epoch(started_after)}) is not earlier than the "
            f"--before bound ({format_epoch(started_before)})."
        )
    if (
        last_active_before is not None
        and last_active_after is not None
        and last_active_after >= last_active_before
    ):
        raise ValueError(
            "Empty activity window: the --newer-than bound "
            f"({format_epoch(last_active_after)}) is not earlier than the "
            f"--older-than bound ({format_epoch(last_active_before)})."
        )

    filters: Dict[str, Any] = {
        # older_than_days=None: the epoch bounds above are the whole story.
        # Without this, prune_sessions' default 90-day cutoff would silently
        # cap an --after/--newer-than-only window.
        "older_than_days": None,
        "last_active_before": last_active_before,
        "last_active_after": last_active_after,
        "started_before": started_before,
        "started_after": started_after,
        "source": getattr(args, "source", None),
        "cron_job": getattr(args, "cron_job", None),
        "title_like": getattr(args, "title", None),
        "end_reason": getattr(args, "end_reason", None),
        "cwd_prefix": getattr(args, "cwd", None),
        "min_messages": getattr(args, "min_messages", None),
        "max_messages": getattr(args, "max_messages", None),
        "model_like": getattr(args, "model", None),
        "provider": getattr(args, "provider", None),
        "user_id": getattr(args, "user", None),
        "chat_id": getattr(args, "chat_id", None),
        "chat_type": getattr(args, "chat_type", None),
        "branch_like": getattr(args, "branch", None),
        "min_tokens": getattr(args, "min_tokens", None),
        "max_tokens": getattr(args, "max_tokens", None),
        "min_cost": getattr(args, "min_cost", None),
        "max_cost": getattr(args, "max_cost", None),
        "min_tool_calls": getattr(args, "min_tool_calls", None),
        "max_tool_calls": getattr(args, "max_tool_calls", None),
    }
    for lo, hi, label, lo_flag, hi_flag in _WINDOWS:
        if bounds[hi] is not None and bounds[lo] is not None and bounds[lo] >= bounds[hi]:
            raise ValueError(
                f"Empty {label} window: the {lo_flag} bound "
                f"({format_epoch(bounds[lo])}) is not earlier than the "
                f"{hi_flag} bound ({format_epoch(bounds[hi])})."
            )

    # older_than_days=None: the epoch bounds are the whole story; otherwise prune_sessions' default
    # 90-day cutoff would silently cap an --after/--newer-than-only window.
    return {"older_than_days": None, **bounds, **{key: getattr(args, attr, None) for key, attr, _ in _ARG_FILTERS}}


def describe_filters(filters: dict[str, Any]) -> str:
    """Human-readable summary of active filters for confirmation prompts."""
    parts = []
    if filters.get("last_active_before") is not None:
        parts.append(
            f"last active before {format_epoch(filters['last_active_before'])}"
        )
    if filters.get("last_active_after") is not None:
        parts.append(
            f"last active after {format_epoch(filters['last_active_after'])}"
        )
    if filters.get("started_before") is not None:
        parts.append(f"started before {format_epoch(filters['started_before'])}")
    if filters.get("started_after") is not None:
        parts.append(f"started after {format_epoch(filters['started_after'])}")
    if filters.get("source"):
        parts.append(f"source '{filters['source']}'")
    if filters.get("cron_job"):
        parts.append(
            f"cron job '{filters['cron_job']}'"
            if str(filters["cron_job"]).strip().lower() != "all"
            else "all cron jobs"
        )
    if filters.get("title_like"):
        parts.append(f"title contains '{filters['title_like']}'")
    if filters.get("end_reason"):
        parts.append(f"end reason '{filters['end_reason']}'")
    if filters.get("cwd_prefix"):
        parts.append(f"cwd under '{filters['cwd_prefix']}'")
    if filters.get("min_messages") is not None:
        parts.append(f">= {filters['min_messages']} messages")
    if filters.get("max_messages") is not None:
        parts.append(f"<= {filters['max_messages']} messages")
    if filters.get("model_like"):
        parts.append(f"model contains '{filters['model_like']}'")
    if filters.get("provider"):
        parts.append(f"provider '{filters['provider']}'")
    if filters.get("user_id"):
        parts.append(f"user '{filters['user_id']}'")
    if filters.get("chat_id"):
        parts.append(f"chat '{filters['chat_id']}'")
    if filters.get("chat_type"):
        parts.append(f"chat type '{filters['chat_type']}'")
    if filters.get("branch_like"):
        parts.append(f"git branch contains '{filters['branch_like']}'")
    if filters.get("min_tokens") is not None:
        parts.append(f">= {filters['min_tokens']} tokens")
    if filters.get("max_tokens") is not None:
        parts.append(f"<= {filters['max_tokens']} tokens")
    if filters.get("min_cost") is not None:
        parts.append(f">= ${filters['min_cost']}")
    if filters.get("max_cost") is not None:
        parts.append(f"<= ${filters['max_cost']}")
    if filters.get("min_tool_calls") is not None:
        parts.append(f">= {filters['min_tool_calls']} tool calls")
    if filters.get("max_tool_calls") is not None:
        parts.append(f"<= {filters['max_tool_calls']} tool calls")
    return ", ".join(parts) if parts else "no filters (all ended sessions)"
