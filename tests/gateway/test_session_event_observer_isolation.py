# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""A failed same-thread projection cannot abort canonical event publication."""
import pytest

from gateway.session_events import SessionEvents


@pytest.mark.parametrize('healthy', [False, True])
def test_failed_observer_isolated_and_not_counted_as_delivery(healthy, caplog):
    stream = SessionEvents()
    received = []
    def broken(frame):
        raise RuntimeError('viewer detached')
    stream.observers.add(broken)
    if healthy:
        stream.observers.add(lambda frame: received.append(frame))
    assert stream.publish('session', {'text': 'committed'}) is healthy
    assert bool(received) is healthy
    replay = stream.since(stream.epoch, 0)
    assert replay['count'] == 1
    assert replay['events'][0]['payload']['text'] == 'committed'
    assert 'observer' in caplog.text.lower()
