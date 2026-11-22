# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

from kestrel_cli import runtime_provider as rp


def test_qwen_oauth_supplied_token_keeps_the_base_url_override(monkeypatch):
    """A supplied token replaces the Qwen CLI login, not the HERMES_QWEN_BASE_URL endpoint."""
    monkeypatch.setattr(rp, "_get_model_config", dict)
    monkeypatch.setenv("HERMES_QWEN_BASE_URL", "https://qwen-proxy.example.test/v1/")

    resolved = rp.resolve_runtime_provider(requested="qwen-oauth", explicit_api_key="fake-qwen-token")

    assert (resolved["api_key"], resolved["base_url"]) == ("fake-qwen-token", "https://qwen-proxy.example.test/v1")
