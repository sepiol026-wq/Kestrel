# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""``hermes profile`` alias names: profiles named like Hermes' server subcommands keep their alias.

A profile's wrapper alias is its own command on PATH (``~/.local/bin/<name>``); it does not shadow
``hermes dashboard``, ``hermes serve`` or ``hermes webapp``, so ``check_alias_collision`` admits those
names as main does: ``hermes profile create dashboard`` gets its ``dashboard`` alias, and ``profile
alias``, rename and import accept them.
"""
from __future__ import annotations

import subprocess

import pytest

from kestrel_cli.profiles import check_alias_collision


@pytest.mark.parametrize("name", ["dashboard", "serve", "webapp"])
def test_an_alias_named_like_a_server_subcommand_is_allowed_as_on_main(monkeypatch, name):
    # No such command on PATH, so only Hermes' own rules decide.
    monkeypatch.setattr(subprocess, "run", lambda *a, **k: subprocess.CompletedProcess(a, 1, "", ""))

    assert check_alias_collision(name) is None
