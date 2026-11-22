# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""The Windows SSH runtime hands a Desktop dev renderer's origin to the serve it spawns."""
from __future__ import annotations

import pytest

from kestrel_cli.windows_ssh_runtime import _spawn_env


@pytest.mark.parametrize("payload, expected", [
    ({"devServer": "http://127.0.0.1:5175"}, "http://127.0.0.1:5175"),  # a dev build's renderer
    ({"devServer": ""}, None),                                           # a packaged build
    ({}, None),                                                          # an older Desktop
])
def test_spawn_env_carries_only_the_payloads_dev_renderer(monkeypatch, payload, expected):
    """The backend trusts a dev renderer's http origin only from the HERMES_DESKTOP_DEV_SERVER it
    inherits, as the POSIX spawn command sets it. One the SSH session happens to export is not this
    Desktop's renderer, so it never leaks into the serve."""
    monkeypatch.setenv("HERMES_DESKTOP_DEV_SERVER", "http://127.0.0.1:5999")
    monkeypatch.setenv("VIRTUAL_ENV", "C:\\venv")

    env = _spawn_env(payload)

    assert env.get("HERMES_DESKTOP_DEV_SERVER") == expected
    assert "VIRTUAL_ENV" not in env


@pytest.mark.parametrize("dev_server", ["http://127.0.0.1:5175\r\nX=1", "http://a\x00b", "h" * 2049])
def test_spawn_env_refuses_a_malformed_dev_renderer(dev_server):
    with pytest.raises(ValueError, match="devServer"):
        _spawn_env({"devServer": dev_server})
