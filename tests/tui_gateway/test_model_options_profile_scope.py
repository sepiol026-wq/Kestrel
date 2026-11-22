# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

from pathlib import Path

from tui_gateway import server


def test_model_options_binds_requested_profile_home(monkeypatch, tmp_path):
    profile_home = tmp_path / "profiles" / "fred-work"
    profile_home.mkdir(parents=True)
    seen = {}

    monkeypatch.setattr(
        server,
        "_profile_home",
        lambda name: profile_home if name == "fred-work" else None,
    )
    monkeypatch.setattr(server, "_model_picker_context", lambda agent: object())

    def build_payload(ctx, **kwargs):
        from kestrel_constants import get_kestrel_home

        seen["home"] = Path(get_kestrel_home())
        return {"providers": []}

    monkeypatch.setattr("hermes_cli.inventory.build_model_options_payload", build_payload)

    response = server._methods["model.options"](1, {"profile": "fred-work"})

    assert response["result"] == {"providers": []}
    assert seen["home"] == profile_home