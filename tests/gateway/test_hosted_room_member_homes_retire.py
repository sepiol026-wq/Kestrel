# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Disband drops the room's recorded member homes with its tombstone: they never pile up per room."""
from gateway import hosted_rooms
from gateway.session_hosted_member_homes import _recorded_homes, record_member_home
from kestrel_state import SessionDB


def test_disband_forgets_the_rooms_member_homes(tmp_path, monkeypatch):
    monkeypatch.setenv('HERMES_HOME', str(tmp_path))
    with SessionDB(tmp_path / 'state.db') as db:
        gateway_id = hosted_rooms.local_authority_gateway_id()
        for room_id in ('room', 'other'):
            hosted_rooms.create_room(db.db_path, room_id=room_id, name=room_id, authority_gateway_id=gateway_id,
                                     members=[{'member_id': 'two', 'profile': 'two', 'handle': 'two'}])
            record_member_home(db, room_id, 'two', tmp_path / 'profiles' / 'two')
        hosted_rooms.disband_room(db.db_path, room_id='room', expected_gateway_id=gateway_id, expected_epoch=1)
        assert _recorded_homes(db, 'room', 'two') == []
        assert _recorded_homes(db, 'other', 'two') == [tmp_path / 'profiles' / 'two']
