# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""The local CLI runs in its launch directory even when started from a gateway agent's terminal."""

from __future__ import annotations

import os
import sys
import types

from kestrel_cli.cli_config_load import _mirror_config_to_env


def _mirror(monkeypatch, tmp_path):
    monkeypatch.chdir(tmp_path)
    monkeypatch.setenv("_HERMES_GATEWAY", "1")  # inherited from the gateway that spawned the shell
    monkeypatch.setenv("TERMINAL_CWD", "/gateway/terminal/cwd")
    _mirror_config_to_env({"terminal": {"backend": "local", "cwd": "/configured/cwd"}}, True)
    return os.environ["TERMINAL_CWD"]


def test_inherited_gateway_marker_does_not_keep_the_gateway_cwd(monkeypatch, tmp_path):
    monkeypatch.delitem(sys.modules, "gateway.run", raising=False)
    assert _mirror(monkeypatch, tmp_path) == str(tmp_path)


def test_gateway_process_keeps_its_bridged_cwd(monkeypatch, tmp_path):
    monkeypatch.setitem(sys.modules, "gateway.run", types.ModuleType("gateway.run"))
    assert _mirror(monkeypatch, tmp_path) == "/gateway/terminal/cwd"
