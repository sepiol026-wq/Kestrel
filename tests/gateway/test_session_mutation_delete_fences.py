# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Deletion covers live descendants before their durable claim."""
from types import SimpleNamespace
import pytest
from gateway.session_authority import LiveSession, SessionAuthority
from gateway.session_controls import AuthorityConnection
from kestrel_state import SessionDB
import kestrel_state_runtime as rt


@pytest.mark.asyncio
async def test_delete_cannot_remove_a_live_delegate_without_a_claim(tmp_path):
    with SessionDB(db_path=tmp_path / 'state.db') as db:
        db.create_session('s', source='test')
        db.create_session('child', source='test', parent_session_id='s', model_config={'_delegate_from': 's'})
        epoch = rt.begin_runtime_epoch(db, instance_id='owner')
        authority = SessionAuthority(SimpleNamespace(_draining=False), profile_id='owned', instance_id='owner', db=db, epoch=epoch)
        authority.sessions['s'] = LiveSession(None, 'route')
        authority.sessions['child'] = LiveSession(None, 'child-route')
        # The descendant's execution is a ledger row, not an in-memory task: it must
        # fence the parent's deletion in the same transaction that would delete it.
        db._execute_write(lambda conn: conn.execute(
            "INSERT INTO worker_executions(execution_id,session_id,kind,owner_epoch,generation,status,adoption_digest) "
            "VALUES('child-exec','child','child',?,0,'running','digest')", (epoch,)))
        owner = AuthorityConnection(authority, object(), {'user_id': 'human'})
        try:
            response = await owner.dispatch({'id': 1, 'method': 'session.mutate', 'params': {'session_id': 's',
                'request_id': 'delete', 'expected_revision': 0, 'expected_generation': 0,
                'operation': 'delete', 'payload': {}}})
            assert response['error']['message'] == 'session_busy'
            assert db.get_session('child') is not None
        finally:
            await owner.close()
