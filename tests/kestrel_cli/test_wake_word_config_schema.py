# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""The config UI offers the same wake providers the runtime resolves."""

from kestrel_cli.config import load_config
from kestrel_cli.web_server_config import _schema_with_dynamic_provider_options
from tools.wake_word import _PROVIDERS, _provider


def test_wake_provider_schema_accepts_default_and_resolves_all_options():
    cfg = load_config()["wake_word"]
    field = _schema_with_dynamic_provider_options()["wake_word.provider"]
    assert field["type"] == "select"
    assert cfg["provider"] in field["options"]
    assert "auto" in field["options"]
    assert {_PROVIDERS[_provider({"provider": choice})][1] for choice in field["options"]} == {
        entry[1] for entry in _PROVIDERS.values()
    }
