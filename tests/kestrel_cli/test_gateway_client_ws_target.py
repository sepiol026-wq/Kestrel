# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Every owner dial (viewer, worker RPC, A2A forward, bot delivery, Ink bootstrap) builds the same target."""
from types import SimpleNamespace

from kestrel_cli.gateway_client import GATEWAY_WS_PROTOCOL, gateway_ws_target


def test_gateway_ws_target_maps_scheme_and_carries_one_ticket_protocol():
    assert gateway_ws_target(SimpleNamespace(api_origin='http://127.0.0.1:9'), 't1') == (
        'ws://127.0.0.1:9/api/ws', [GATEWAY_WS_PROTOCOL, 'hermes-gateway-ticket.t1'])
    url, protocols = gateway_ws_target(SimpleNamespace(api_origin='https://owner.local'), 't2')
    assert url == 'wss://owner.local/api/ws' and protocols[0] == 'hermes-gateway-v1'
