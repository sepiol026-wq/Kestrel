# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""A retired physical ID cannot be assigned to a different imported transcript."""
import pytest
from kestrel_state import SessionDB
import kestrel_state_runtime as rt


def test_import_cannot_reuse_a_deleted_receipt_identity(tmp_path):
    with SessionDB(db_path=tmp_path / 'state.db') as db:
        epoch = rt.begin_runtime_epoch(db, instance_id='owner')
        db.create_session('s', source='cli')
        deleted = rt.mutate_runtime_session(db, epoch=epoch, principal_id='human', session_id='s',
            request_id='delete', expected_revision=0, expected_generation=0, operation='delete', payload={})
        with pytest.raises(rt.RuntimeStoreError, match='admission_conflict'):
            rt.mutate_runtime_session(db, epoch=epoch, principal_id='human', session_id='new',
                request_id='import', expected_revision=0, operation='import', payload={'sessions': [
                    {'id': 'new', 'source': 'cli'}, {'id': 's', 'source': 'cli'}]})
        assert db.get_session('s') is None and db.get_session('new') is None
        assert rt.mutate_runtime_session(db, epoch=epoch, principal_id='human', session_id='s',
            request_id='delete', expected_revision=0, expected_generation=0, operation='delete', payload={}) == deleted
