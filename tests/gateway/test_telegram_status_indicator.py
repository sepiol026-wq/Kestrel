# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Tests for the Telegram bot status indicator.

Telegram bots have no real online/offline presence dot (that's a user-account
feature). The closest Bot API surface is the bot's *short description* — the
line shown under the bot's name in its profile. When `extra.status_indicator`
is enabled, the adapter sets it to "Online" on connect and "Offline" on clean
disconnect so users can tell whether the gateway is up.
"""

from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest

from gateway.config import PlatformConfig
from plugins.platforms.telegram.adapter import TelegramAdapter


def _make_adapter(extra, home):
    adapter = TelegramAdapter(PlatformConfig(enabled=True, token="***", extra=extra))
    adapter._update_receipt_dir = home  # the operator's text is saved here before the first write
    adapter._bot = MagicMock(id=4242)
    adapter._bot.get_my_short_description = AsyncMock(return_value=SimpleNamespace(short_description="My bot"))
    adapter._bot.set_my_short_description = AsyncMock()
    return adapter




@pytest.mark.asyncio
async def test_disabled_is_noop(tmp_path):
    adapter = _make_adapter(extra={"status_indicator": False}, home=tmp_path)
    await adapter._set_status_indicator(online=True)
    adapter._bot.set_my_short_description.assert_not_called()


@pytest.mark.asyncio
async def test_online_sets_default_text(tmp_path):
    adapter = _make_adapter(extra={"status_indicator": True}, home=tmp_path)
    await adapter._set_status_indicator(online=True)
    adapter._bot.set_my_short_description.assert_awaited_once_with(
        short_description="Online"
    )


