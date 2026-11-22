# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""The image's non-root runtime uses its staged tools and generated assets."""
from __future__ import annotations

import subprocess


def test_python_uses_pm_interpreter_as_runtime_user(built_image: str) -> None:
    probe = """
from pathlib import Path
import sys
from pm.lock import Facts
from pm.registry import get_package
from pm.store import current_target

store = Path('/opt/hermes/tools')
assert not list(store.glob('fetch-*')), 'completed download archives must not ship'
fact = Facts(store / 'facts.json').get('python')
expected = get_package('python').binary(store / fact['entry'], current_target())
assert Path(sys._base_executable).resolve() == expected.resolve()
import kestrel_yaml as yaml
print('PM interpreter and application dependencies load as hermes')
"""
    result = subprocess.run(
        ["docker", "run", "--rm", "--network", "none", "--user", "hermes",
         "--entrypoint", "/opt/hermes/.venv/bin/python", built_image, "-c", probe],
        capture_output=True, text=True, timeout=60,
        check=False,
    )
    assert result.returncode == 0, result.stdout + result.stderr


def test_dashboard_ships_generated_icon_without_build_environment(built_image: str) -> None:
    probe = """
from pathlib import Path
from PIL import Image

with Image.open('/opt/hermes/hermes_cli/web_dist/favicon.ico') as image:
    image.load()
    assert image.width > 0 and image.height > 0
assert not Path('/opt/hermes/node_modules/vite').exists()
assert not Path('/opt/hermes/node_modules/esbuild').exists()
assert Path('/opt/hermes/node_modules/typescript/bin/tsc').is_file()
"""
    result = subprocess.run(
        ["docker", "run", "--rm", "--network", "none", "--user", "hermes",
         "--entrypoint", "/opt/hermes/.venv/bin/python", built_image, "-c", probe],
        capture_output=True, text=True, timeout=60,
        check=False,
    )
    assert result.returncode == 0, result.stdout + result.stderr
