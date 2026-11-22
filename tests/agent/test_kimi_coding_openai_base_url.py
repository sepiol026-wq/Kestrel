# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

import pytest
from unittest.mock import MagicMock
from agent.agent_runtime_helpers import create_openai_client


def _fake_openai_factory(captured_kwargs):
    def fake_openai(**kwargs):
        captured_kwargs.update(kwargs)
        return MagicMock()
    return fake_openai


def test_create_openai_client_normalizes_kimi_coding_base_url(monkeypatch):
    """#102247: OpenAI-wire client creation must normalize api.kimi.com/coding to /v1
    to avoid HTTP 404 when appending /chat/completions."""
    mock_agent = MagicMock()
    mock_agent.provider = "kimi-coding"
    mock_agent._build_keepalive_http_client.return_value = None
    mock_agent._client_log_context.return_value = "test_context"

    captured_kwargs = {}
    monkeypatch.setattr("agent.process_bootstrap.OpenAI", _fake_openai_factory(captured_kwargs))

    client_kwargs = {
        "api_key": "sk-kimi-test12345",
        "base_url": "https://api.kimi.com/coding",
    }

    client = create_openai_client(mock_agent, client_kwargs, reason="test", shared=False)
    assert client is not None
    assert captured_kwargs.get("base_url") == "https://api.kimi.com/coding/v1"


def test_create_openai_client_preserves_already_suffixed_kimi_url(monkeypatch):
    """Already-suffixed /v1 should remain unchanged."""
    mock_agent = MagicMock()
    mock_agent.provider = "kimi-coding"
    mock_agent._build_keepalive_http_client.return_value = None
    mock_agent._client_log_context.return_value = "test_context"

    captured_kwargs = {}
    monkeypatch.setattr("agent.process_bootstrap.OpenAI", _fake_openai_factory(captured_kwargs))

    client_kwargs = {
        "api_key": "sk-kimi-test12345",
        "base_url": "https://api.kimi.com/coding/v1",
    }

    create_openai_client(mock_agent, client_kwargs, reason="test", shared=False)
    assert captured_kwargs.get("base_url") == "https://api.kimi.com/coding/v1"
