# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""`hermes computer-use screen install` shares the Desktop pane's installer (one lock, list-form spawn)."""

from __future__ import annotations

import argparse
import subprocess

from kestrel_cli.subcommands.computer_use_screen import build_screen_parser
from tools.bot_desktop import install, runtime


def test_cli_install_goes_through_the_shared_installer(monkeypatch):
    monkeypatch.setattr(runtime, "is_supported_host", lambda: True)
    monkeypatch.setattr(runtime, "missing_binaries", lambda: ["Xvnc"])
    monkeypatch.setattr(runtime, "install_command", lambda: "sudo apt-get install -y tigervnc-standalone-server")
    monkeypatch.setattr(subprocess, "run", lambda *a, **k: (_ for _ in ()).throw(AssertionError("shell install spawned")))
    calls = []

    def fake_install(*, ask_password, on_line, **kw):
        calls.append((callable(ask_password), callable(on_line)))
        return 0

    monkeypatch.setattr(install, "install_packages", fake_install)
    monkeypatch.setattr(runtime, "missing_binaries", lambda: ["Xvnc"] if not calls else [])
    parser = argparse.ArgumentParser()
    build_screen_parser(parser.add_subparsers(), lambda sub, help_text: sub.add_argument("--json", action="store_true"))
    args = parser.parse_args(["screen", "install", "-y"])
    assert args.screen_func(args) == 0
    assert calls == [(True, True)]
