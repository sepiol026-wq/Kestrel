# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Web setup reports the selected backend without interrupting config writes."""

import pytest


@pytest.mark.parametrize("managed,backend", [(True, "firecrawl"), (False, "perplexity"), (False, "exa")])
def test_web_selection_reports_the_backend_it_writes(monkeypatch, managed, backend):
    import kestrel_cli.tools_config_providers as providers

    monkeypatch.setattr(providers, "_nous_provider_gate", lambda *a, **kw: True)
    messages = []
    monkeypatch.setattr(providers, "_print_success", messages.append)
    row = {"name": "Test provider", "web_backend": backend, "env_vars": []}
    if managed:
        row["managed_nous_feature"] = "web"
    config = {}
    providers._configure_provider(row, config)
    selected = config["web"]["backend"]
    assert selected == ("nous" if managed else backend)
    assert f"  Web backend set to: {selected}" in messages
