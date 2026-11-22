# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""/snapshot restore in a gateway-backed classic CLI keeps the CLI on its gateway session.

Regression for #134889 N7: after a /snapshot restore, /context raised
``'GatewayAgent' object has no attribute 'load_soul_identity'``.
"""
from types import SimpleNamespace

from kestrel_cli.cli_commands_mixin import CLICommandsMixin
from kestrel_cli.gateway_session_store import GatewaySessionStore
from kestrel_cli.gateway_side import connection_for


class _Conn:
    final = False
    closed = False


def test_a_snapshot_restore_leaves_the_cli_on_its_gateway_session(monkeypatch):
    """Main closed its own SessionDB before restoring. Rewired, ``_session_db`` is the gateway session
    store: dropping it left every later command off the gateway, and /context then ran main's local
    breakdown on the gateway stand-in agent."""
    monkeypatch.setattr("hermes_cli.backup.restore_quick_snapshot", lambda snap_id: False)
    monkeypatch.setattr("hermes_cli.backup.list_quick_snapshots", lambda limit=None: [{"id": "snap-1"}])
    conn = _Conn()
    cli = SimpleNamespace(_session_db=GatewaySessionStore(conn), _gateway_session_open=True)
    assert connection_for(cli) is conn
    CLICommandsMixin._snapshot_restore(cli, ["/snapshot", "restore", "snap-1"])
    assert connection_for(cli) is conn
