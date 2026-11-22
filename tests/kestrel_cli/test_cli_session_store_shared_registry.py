# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""The CLI's session store is the gateway's, never a state.db writer in the CLI process.

Main acquired ``hermes_state_registry`` (a writer handle) at startup. Rewired, the gateway is the
single writer: ``_init_session_store`` builds a ``GatewaySessionStore`` and opens no SessionDB.
"""

from types import SimpleNamespace

from cli import HermesCLI


def test_cli_session_store_is_the_gateway_store_and_opens_no_writer(monkeypatch):
    import kestrel_state_registry
    from kestrel_cli.gateway_session_store import GatewaySessionStore

    constructed = []
    monkeypatch.setattr(hermes_state_registry, "_open_session_db", lambda path: constructed.append(path))
    cli = SimpleNamespace()
    HermesCLI._init_session_store(cli)
    assert isinstance(cli._session_db, GatewaySessionStore) and not cli._session_db_unavailable
    assert constructed == []
