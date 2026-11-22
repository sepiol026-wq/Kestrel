# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""install.sh sends Termux hosts to the APT package instead of building a source install."""
import os
from pathlib import Path
import subprocess

import pytest

INSTALL_SH = Path(__file__).resolve().parent.parent.parent.parent / "scripts" / "install.sh"


@pytest.mark.parametrize("marker", [{"TERMUX_VERSION": "0.118.0"}, {"PREFIX": "/data/data/com.termux/files/usr"}])
def test_termux_host_is_refused_before_any_stage_with_apt_hint(tmp_path, marker):
    env = {k: v for k, v in os.environ.items() if k not in ("TERMUX_VERSION", "PREFIX")}
    env.update(marker, HOME=tmp_path.as_posix(), HERMES_HOME=(tmp_path / "home").as_posix(),
               HERMES_INSTALL_DIR=(tmp_path / "install").as_posix())
    result = subprocess.run(["bash", INSTALL_SH.as_posix(), "--stage", "prerequisites"],
                            env=env, capture_output=True, text=True, timeout=30, check=False)
    assert result.returncode != 0
    assert "pkg install kestrel-agent" in result.stderr
    assert not (tmp_path / "install").exists()


def test_plain_linux_host_passes_platform_check(tmp_path):
    env = {k: v for k, v in os.environ.items() if k not in ("TERMUX_VERSION", "PREFIX")}
    env.update(HOME=tmp_path.as_posix(), HERMES_HOME=(tmp_path / "home").as_posix(),
               HERMES_INSTALL_DIR=(tmp_path / "install").as_posix())
    result = subprocess.run(["bash", INSTALL_SH.as_posix(), "--stage", "prerequisites"],
                            env=env, capture_output=True, text=True, timeout=30, check=False)
    assert result.returncode == 0, result.stderr
