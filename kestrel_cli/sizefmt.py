# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Small shared size-formatting helpers for CLI/agent output (sibling of ``hermes_cli.timefmt``:
a tiny purpose-named module lightweight consumers can import without the CLI surface)."""

from __future__ import annotations


def format_bytes(n) -> str:
    """1234567 -> '1.2 MB' (B/KB/MB/GB/TB; integer bytes, one decimal above). Returns ``"?"`` for
    None or unparseable input so display call sites never raise."""
    try:
        size = float(n)
    except (TypeError, ValueError):
        return "?"
    if size < 1024:
        return f"{int(size)} B"
    for unit in ("KB", "MB", "GB"):
        size /= 1024.0
        if size < 1024:
            return f"{size:.1f} {unit}"
    return f"{size / 1024.0:.1f} TB"
