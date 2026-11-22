# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Worker read receipts leave the session CAS fence where a client last saw it (W14)."""
from kestrel_state_runtime import mutate_runtime_session
from tests.hermes_state.test_runtime_worker_lifecycle import setup_store


def test_worker_reads_keep_revision_and_writes_still_advance_it(tmp_path):
    db, store, scope = setup_store(tmp_path)
    try:
        store.append_messages_batch('owned', [{'role': 'user', 'content': 'hello'}])
        seen = db.get_session('owned')['runtime_revision']
        store.get_session('owned')
        store.session_lifecycle_statuses(['owned'])
        store.get_messages_as_conversation('owned')
        store.get_compression_tip('owned')
        assert db.get_session('owned')['runtime_revision'] == seen
        # A client mutation built on the pre-read revision is not refused by those reads.
        result = mutate_runtime_session(db, epoch=scope['epoch'], principal_id='client', session_id='owned',
                                        request_id='rename', expected_revision=seen,
                                        operation='rename', payload={'title': 'renamed'})
        assert result['revision'] == seen + 1
        store.touch_session_activity('owned', description='working')
        assert db.get_session('owned')['runtime_revision'] == seen + 2
        store.finish()
        assert db.get_session('owned')['runtime_revision'] == seen + 3
    finally:
        store.close()
        db.close()
