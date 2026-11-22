# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""The dashboard's legacy /chat pump (no ``?attach=`` token) closes as on main.

Whether the child exited (EOF) or the socket or read failed, the pump reaps the child and closes the
browser socket normally (1000). Only the keep-alive path reports an exited child with 4410.
"""
import asyncio
from unittest.mock import Mock

import pytest
from starlette.websockets import WebSocket

from kestrel_cli.web_server_chat import _legacy_pump


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.mark.anyio
@pytest.mark.parametrize("failure", [None, "send", "read"])
async def test_legacy_pump_closes_normally_and_reaps_the_child_as_on_main(failure):
    incoming = asyncio.Queue()
    await incoming.put({"type": "websocket.connect"})
    closes = []

    async def send(message):
        if message["type"] == "websocket.send" and failure == "send":
            raise RuntimeError("transport failed")
        if message["type"] == "websocket.close":
            closes.append(message["code"])
            await incoming.put({"type": "websocket.disconnect", "code": message["code"]})

    ws = WebSocket({"type": "websocket"}, incoming.get, send)
    await ws.accept()
    bridge = Mock()
    bridge.read.side_effect = [RuntimeError("read failed")] if failure == "read" else [b"output", None]
    await asyncio.wait_for(_legacy_pump(ws, bridge), timeout=3)
    assert closes == [1000]
    bridge.close.assert_called()
