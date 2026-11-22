# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""`hermes memory status` should explain *why* a provider is unavailable.

Regression coverage for sepiol026-wq/Kestrel#2765: when the selected
provider reports unavailable, status lists the missing env vars and surfaces
the systemd/gateway ``.env``-inheritance gotcha that most often causes it.
"""

from kestrel_cli import memory_setup


class _UnavailableProvider:
    def is_available(self):
        return False

    def get_config_schema(self):
        return [
            {
                "key": "api_key",
                "env_var": "HINDSIGHT_API_KEY",
                "secret": True,
                "url": "https://ui.hindsight.vectorize.io",
            }
        ]


def test_status_surfaces_env_inheritance_hint_when_unavailable(monkeypatch, capsys):
    monkeypatch.delenv("HINDSIGHT_API_KEY", raising=False)
    monkeypatch.setattr(
        memory_setup,
        "_get_available_providers",
        lambda: [("hindsight", "cloud", _UnavailableProvider())],
    )
    monkeypatch.setattr(
        "hermes_cli.config.load_config",
        lambda: {"memory": {"provider": "hindsight", "hindsight": {}}},
    )

    memory_setup.cmd_status(object())
    out = capsys.readouterr().out

    assert "not available" in out
    assert "HINDSIGHT_API_KEY" in out  # names the missing var
    assert ".env" in out               # systemd/gateway root-cause hint
