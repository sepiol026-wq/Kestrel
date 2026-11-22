# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""``hermes desktop --install-apparmor-profile`` outside Linux (#130177 review)."""

from __future__ import annotations

from pathlib import Path

import pytest

from kestrel_cli import main_desktop_apparmor

pytestmark = pytest.mark.platforms("not linux")


def test_install_apparmor_profile_refuses_before_any_warning_or_sudo(tmp_path, monkeypatch, capsys):
    """No security warning and no raw "apparmor_parser not found": one Linux-only line."""
    calls: list[list[str]] = []
    monkeypatch.setattr(main_desktop_apparmor, "_run", lambda command, stdin_text=None: calls.append(command))

    assert main_desktop_apparmor.install_profile(Path(tmp_path / "Hermes")) is False
    assert calls == []
    assert capsys.readouterr().out.strip() == (
        "✗ --install-apparmor-profile is Linux only: AppArmor profiles do not exist on this OS.")
