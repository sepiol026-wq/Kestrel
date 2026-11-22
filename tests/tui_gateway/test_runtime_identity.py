# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Runtime identity contract for TUI gateway machine protocol fields."""

from types import SimpleNamespace

import kestrel_cli
from tui_gateway import server


def test_session_info_advertises_base_version_and_release_date(monkeypatch):
    monkeypatch.setattr(
        "hermes_cli.version_info.get_version_info",
        lambda: SimpleNamespace(base_version="1.2.3", derived_version="1.2.3+4.gabcdef0"),
    )
    monkeypatch.setattr(hermes_cli, "__release_date__", "2026.9.23")

    info = server._session_info(None, {})

    assert info["version"] == "1.2.3"
    assert info["release_date"] == "2026.9.23"
