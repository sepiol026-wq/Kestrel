# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""A desktop check must not reinterpret unreadable channel config as main."""
from pathlib import Path
import os
import subprocess
import sys

import pytest


@pytest.mark.parametrize("content", ["update: [", "- not-a-mapping", b"\xff"])
def test_invalid_config_refuses_desktop_channel_probe(tmp_path, content):
    home = tmp_path / "home"
    home.mkdir()
    config = home / "config.yaml"
    config.write_bytes(content.encode() if isinstance(content, str) else content)
    root = Path(__file__).resolve().parents[2]
    result = subprocess.run(
        [sys.executable, "-m", "hermes_cli.source_check", "--install-root", str(root), "--home", str(home)],
        cwd=root, env={**os.environ, "HERMES_HOME": str(home), "HERMES_IGNORE_USER_CONFIG": "0"},
        capture_output=True, text=True, timeout=30,
        check=False,
    )
    assert result.returncode != 0, result.stdout + result.stderr
    assert '"channel": "main"' not in result.stdout
    assert "config" in result.stderr
    assert config.read_bytes() == (content.encode() if isinstance(content, str) else content)
