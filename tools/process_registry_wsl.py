# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Detect background spawns routed through a ``wsl[.exe]`` launcher chain (#120546)."""

from __future__ import annotations

import os
import shlex

_WSL_LAUNCHER_NAMES = frozenset({"wsl", "wsl.exe"})


def _is_wsl_launcher_command(command: str) -> bool:
    """True when *command* routes through a ``wsl[.exe]`` launcher chain (#120546).

    The host PID recorded for such a spawn belongs to the short-lived launcher;
    grandchildren inside the VM outlive it, so the entry must say so instead of
    letting host-side hunting fail silently.
    """
    if not isinstance(command, str) or not command.strip():
        return False
    candidates = []
    try:
        candidates.append((shlex.split(command, posix=True) or [""])[0])
    except ValueError:
        pass
    # POSIX shlex eats Windows backslashes (``C:\...\wsl.exe``), so also try
    # the naive first token where path separators survive.
    words = command.strip().split()
    if words:
        candidates.append(words[0])
    for first in candidates:
        base = os.path.basename(first.replace("\\", "/")).strip("'\"").lower()
        if base in _WSL_LAUNCHER_NAMES:
            return True
    return False
