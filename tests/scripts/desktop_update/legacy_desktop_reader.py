# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Run the update-marker reader an old packaged Desktop shipped (not collected)."""
from __future__ import annotations

import json
from pathlib import Path
import shutil
import subprocess

import pytest

LEGACY_READER = Path(__file__).resolve().parents[2] / "fixtures" / "legacy_desktop" / "update-marker-be3fd671.mts"


def legacy_read(home: Path) -> dict:
    """The exact reader an old packaged Desktop runs at boot: line 1 dead or line 2 past 20
    minutes => it unlinks the marker and starts its backend. {'live': {pid, ageMs} | None,
    'kept': marker still exists afterwards}."""
    node = shutil.which("node")
    if node is None:
        pytest.skip("node is needed to run the shipped Desktop reader")
    code = (f"import fs from 'fs'; import {{ readLiveUpdateMarker }} from {json.dumps(LEGACY_READER.as_uri())}; "
            "const live = readLiveUpdateMarker(process.argv[1]); "
            "console.log(JSON.stringify({ live, kept: fs.existsSync(process.argv[1] + '/.hermes-update-in-progress') }))")
    out = subprocess.run([node, "--input-type=module", "-e", code, str(home)], capture_output=True, text=True,
                         encoding="utf-8", timeout=60, check=False)
    assert out.returncode == 0, out.stderr
    return json.loads(out.stdout.strip().splitlines()[-1])
