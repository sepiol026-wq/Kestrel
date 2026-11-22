# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""A live local session whose route entry the loaded store cannot see rebuilds it from its receipt."""
import pytest

from tests.gateway.test_local_recovery_pre_profile_origin import _served_authority


@pytest.mark.asyncio
async def test_live_session_rebuilds_a_route_entry_missing_from_the_store(tmp_path, monkeypatch):
    from gateway.session_contract import SessionActor
    from gateway.session_local import create_local_session
    from gateway.session_local_recovery import restore_local_session
    from kestrel_state_local import local_receipt

    served, db, secondary = await _served_authority(tmp_path, monkeypatch, 'first')
    actor = SessionActor('owner', str(secondary), frozenset({'session:create', 'session:read'}), 'socket')
    ref = create_local_session(served, actor, {'request_id': 'live', 'source': 'gui',
                                               'cwd': str(tmp_path), 'model': 'frozen', 'toolsets': []})
    route = served.sessions[ref.session_id].route
    store = served.runner.session_store
    with store._lock:
        # A row under a scope the store never reads (an older release's ``''``), or one the prune retired.
        store._entries.pop(route)

    assert restore_local_session(served, ref.session_id) == ref
    with store._lock:
        assert store._entries[route].session_id == local_receipt(db, ref.session_id)['entry']['session_id']
