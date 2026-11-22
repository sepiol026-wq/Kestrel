# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Generated bootstrap pins must match the shared pin and mirror authorities."""
import subprocess
import sys
from pathlib import Path


def test_fragments_match_the_pin_table():
    root = Path(__file__).resolve().parents[2]
    result = subprocess.run(
        [sys.executable, str(root / "scripts/gen-bootstrap-pins.py"), "--check"],
        cwd=root, capture_output=True, text=True, timeout=60,
        check=False,
    )
    assert result.returncode == 0, result.stdout + result.stderr
