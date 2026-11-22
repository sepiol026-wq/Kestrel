# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Worker rotation carries automation in the publication transaction."""
import json


def test_publication_moves_automation_once_and_preserves_cleared_controls(worker):
    db, store = worker
    values = {'goal': {'goal': 'retain objective', 'status': 'paused'},
              'loop': {'prompt': 'retain loop', 'status': 'active', 'interval_seconds': 60},
              'heartbeat': {'status': 'active', 'interval_seconds': 120}}
    for family, value in values.items():
        db.set_meta(f'{family}:owned', json.dumps(value))
    assert store.try_acquire_compression_lock('owned', 'compressor')
    store.publish_compression_child(parent_session_id='owned', child_session_id='child', source='cli',
        messages=[{'role': 'assistant', 'content': 'summary'}], compression_lock_holder='compressor')
    for family, value in values.items():
        raw = db.get_meta(f'{family}:child')
        assert raw is not None, family
        assert json.loads(raw)['status'] == value['status']
        assert json.loads(db.get_meta(f'{family}:owned'))['status'] == 'cleared'
    assert json.loads(db.get_meta('goal:child'))['goal'] == values['goal']['goal']
    assert json.loads(db.get_meta('loop:child'))['prompt'] == values['loop']['prompt']
