# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Anthropic-messages clients honour ``custom_providers[].extra_headers`` (#24293, #9721).

The OpenAI-wire clients apply the per-provider headers; ``build_anthropic_client`` used to skip
them, so a relay behind a WAF that rejects the SDK User-Agent kept 403ing in anthropic_messages mode.
"""
from unittest.mock import patch

from agent.anthropic_adapter import build_anthropic_client

_ROUTE = "https://proxy.example.com/v1"
_CONFIG = {"custom_providers": [{
    "name": "wafproxy", "base_url": _ROUTE, "api_mode": "anthropic_messages",
    "extra_headers": {"User-Agent": "HermesAgent/1.0", "X-Privacy-Tier": "enterprise"},
}]}


def _build(route):
    with patch("agent.anthropic_adapter._require_sdk") as sdk, patch("hermes_cli.config.load_config", return_value=_CONFIG):
        build_anthropic_client("sk-test", route)
    return sdk.return_value.Anthropic.call_args.kwargs["default_headers"]


def test_matching_route_merges_extra_headers_after_betas():
    headers = _build(_ROUTE)
    assert headers["User-Agent"] == "HermesAgent/1.0"
    assert headers["X-Privacy-Tier"] == "enterprise"
    assert "anthropic-beta" in headers  # provider headers add to, not replace, the beta set


def test_other_route_does_not_inherit_extra_headers():
    headers = _build("https://other.example.com/v1")
    assert "User-Agent" not in headers and "X-Privacy-Tier" not in headers
