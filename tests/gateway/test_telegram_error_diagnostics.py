# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Tests for detailed error diagnostics in the Telegram adapter and gateway error surface."""

import os
from unittest.mock import patch

import pytest

from gateway.config import PlatformConfig
from gateway.platforms.base import Platform
from gateway.run import (
    _sanitize_gateway_final_response,
    _normalize_empty_agent_response,
    _should_show_error_details,
)
from plugins.platforms.telegram.adapter import TelegramAdapter


def test_telegram_error_details_shown_when_env_enabled(monkeypatch):
    monkeypatch.setenv("KESTREL_SHOW_ERROR_DETAILS", "1")
    assert _should_show_error_details(Platform.TELEGRAM) is True

    raw_err = "API call failed: litellm.APIConnectionError: Connection reset by peer for host api.openai.com [status_code=502]"
    sanitized = _sanitize_gateway_final_response(Platform.TELEGRAM, raw_err)

    assert "⚠️" in sanitized
    assert "litellm.APIConnectionError" in sanitized
    assert "status_code=502" in sanitized
    assert "```" in sanitized


def test_telegram_error_details_redacts_sensitive_tokens(monkeypatch):
    monkeypatch.setenv("KESTREL_SHOW_ERROR_DETAILS", "1")

    raw_err = (
        "API call failed: Authorization failed for Bearer sk-ant-api03-1234567890abcdef1234567890abcdef1234567890-test: "
        "litellm.AuthenticationError: Invalid token provided"
    )
    sanitized = _sanitize_gateway_final_response(Platform.TELEGRAM, raw_err)

    assert "sk-ant-api03" not in sanitized
    assert "Invalid token provided" in sanitized
    assert "```" in sanitized


def test_normalize_empty_agent_response_includes_diagnostics(monkeypatch):
    monkeypatch.setenv("KESTREL_SHOW_ERROR_DETAILS", "1")

    agent_result = {
        "final_response": "",
        "failed": True,
        "error": "API call failed: Provider returned HTTP 429 Too Many Requests (rate limit exceeded)",
        "api_calls": 1,
        "platform": Platform.TELEGRAM,
    }

    reply = _normalize_empty_agent_response(agent_result, "", history_len=1, platform=Platform.TELEGRAM)
    assert "HTTP 429" in reply
    assert "Too Many Requests" in reply
    assert "```" in reply


def test_telegram_adapter_enables_error_details_by_default():
    config = PlatformConfig(
        enabled=True,
        token="123456789:AAFakeSecretTelegramBotTokenABCDEFGHIJ",
        extra={"show_error_details": True},
    )
    adapter = TelegramAdapter(config)
    assert adapter._show_error_details is True

    with patch.dict(os.environ, {}, clear=True):
        assert os.environ.get("KESTREL_SHOW_ERROR_DETAILS") is None
        with patch.object(adapter, "_acquire_platform_lock", return_value=False):
            import asyncio
            asyncio.run(adapter.connect())
            assert os.environ.get("KESTREL_SHOW_ERROR_DETAILS") == "1"
