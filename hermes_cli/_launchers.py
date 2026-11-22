# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Compatibility shim forwarding hermes_cli._launchers to kestrel_cli._launchers."""
import runpy
import sys
from pathlib import Path

_ROOT = Path(__file__).resolve().parents[1]
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from kestrel_cli._launchers import *  # noqa: F403

if __name__ == "__main__":
    target = _ROOT / "kestrel_cli" / "_launchers.py"
    runpy.run_path(str(target), run_name="__main__")
