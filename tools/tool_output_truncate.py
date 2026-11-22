# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Head/tail truncation for oversized tool output (terminal, execute_code, MCP results).

One algorithm and one notice wording: 40% head (errors surface early) / 60% tail (the most
recent lines matter most) around a single ``... [<LABEL> TRUNCATED - N <unit> omitted out of
T total] ...`` marker, so downstream code that recognises the marker sees one shape. Limits
live in ``tools/tool_output_limits.py``; line-snapped, path-bearing footers (web/browser,
read_file pagination) are different products and stay separate.
"""

from __future__ import annotations

HEAD_RATIO = 0.4


def truncation_notice(omitted: int, total: int, *, label: str = "OUTPUT", unit: str = "chars") -> str:
    return f"\n\n... [{label} TRUNCATED - {omitted:,} {unit} omitted out of {total:,} total] ...\n\n"


def head_tail_split(budget: int) -> tuple[int, int]:
    """``(head, tail)`` character budgets for ``budget`` total."""
    head = int(budget * HEAD_RATIO)
    return head, budget - head


def truncate_head_tail(text: str, max_chars: int, *, label: str = "OUTPUT") -> str:
    """``text`` unchanged when it fits ``max_chars``; otherwise head + notice + tail (the kept
    text is exactly ``max_chars`` long, the notice rides on top)."""
    if len(text) <= max_chars:
        return text
    head, tail = head_tail_split(max_chars)
    omitted = len(text) - head - tail
    return text[:head] + truncation_notice(omitted, len(text), label=label) + text[-tail:]
