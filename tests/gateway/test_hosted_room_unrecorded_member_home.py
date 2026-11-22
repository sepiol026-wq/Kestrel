# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""A deferred turn this host has no recorded home for (dispatched before homes were recorded), whose
profile's roster entry is gone: the home its daemon ran from is unknown, so an absent conventional
profile directory proves nothing and the turn keeps Disband waiting."""
import sqlite3

import pytest

from gateway import hosted_room_driver as tasks
from gateway import hosted_rooms
from tests.gateway.test_hosted_room_unserved_member_stop import _disband
from tests.gateway.test_hosted_room_unserved_member_stop import deferred as deferred_fixture

deferred = deferred_fixture


def test_an_unrecorded_custom_home_keeps_the_turn(tmp_path, deferred):
    service, db, identity, roster = deferred(tmp_path.resolve() / 'custom' / 'two')
    with sqlite3.connect(db) as conn:  # as left by a gateway that never recorded member homes
        conn.execute("DELETE FROM state_meta WHERE key LIKE 'gateway.hosted.member_homes.v1:%'")
    del roster['two']
    with pytest.raises(hosted_rooms.RoomStopPendingError):
        _disband(service)
    assert tasks.get_task(db, identity)['status'] == 'deferred'
