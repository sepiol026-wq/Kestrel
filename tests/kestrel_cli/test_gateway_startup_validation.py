# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Invalid launch options must not inspect configuration they bypass."""
from argparse import Namespace


def test_invalid_options_are_reported_before_reading_profile(monkeypatch, capsys):
    from kestrel_cli.gateway_chat_startup import launch_gateway_chat

    def unexpected():
        raise AssertionError("Unsupported launch read profile configuration")

    monkeypatch.setattr("hermes_cli.main._has_any_provider_configured", unexpected)
    assert launch_gateway_chat(Namespace(worktree=True)) == 2
    assert "--worktree" in capsys.readouterr().err
    # A bypass launch skips provider probing and the profile cost guard entirely.
    monkeypatch.setattr("hermes_cli.main._confirm_startup_expensive_model_override", lambda args: unexpected())
    from kestrel_cli.gateway_client import GatewayClientError

    def refused():
        raise GatewayClientError("transport reached")
    monkeypatch.setattr("hermes_cli.gateway_chat.connect_gateway", refused)
    assert launch_gateway_chat(Namespace(safe_mode=True, model="explicit", provider="custom", query="x")) == 1
    assert "transport reached" in capsys.readouterr().err
