# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Sibling-backend child for the turn-marker cross-process race test (spawned, so importable)."""

from __future__ import annotations


def record_after_parent_moves(home: str, session_key: str, loaded, proceed) -> None:
    """Start a turn on *session_key*, pausing between the marker file's load and its store until
    *proceed* is set — the window a second backend on the same HERMES_HOME races into."""
    from tui_gateway import turn_marker

    original_load = turn_marker._load

    def paused_load(path):
        entries = original_load(path)
        loaded.set()
        proceed.wait(30)
        return entries

    turn_marker._load = paused_load
    turn_marker.record_turn_start(home, session_key, "second prompt")
