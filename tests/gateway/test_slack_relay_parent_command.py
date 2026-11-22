# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

import pytest

from gateway.config import Platform
from gateway.platforms.event import MessageType
from gateway.relay.ws_transport import _event_from_wire


def _wire(text: str, *, platform: str = "slack") -> dict:
    return {
        "text": text,
        "message_type": "command",
        "source": {
            "platform": platform,
            "chat_id": "D123",
            "chat_type": "dm",
            "user_id": "U123",
        },
    }


@pytest.mark.parametrize(
    ("wire_text", "expected"),
    [
        ("/hermes sethome", "/sethome"),
        ("/hermes\tsethome", "/sethome"),
        (
            "/kestrel model gpt-5.6 --provider openai",
            "/model gpt-5.6 --provider openai",
        ),
        ("/hermes", "/help"),
    ],
)
def test_slack_relay_parent_becomes_gateway_command(wire_text: str, expected: str):
    event = _event_from_wire(_wire(wire_text))

    assert event.text == expected
    assert event.message_type == MessageType.COMMAND
    assert event.source.platform == Platform.SLACK
    assert event.source.delivered_via_upstream_relay is True


