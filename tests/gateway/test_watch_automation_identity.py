# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Distinct pattern hits must not collapse into one completion identity."""
import json


def test_watch_event_identity_survives_retry_but_not_another_hit():
    from gateway.run import GatewayRunner
    from tools.process_registry import ProcessRegistry, ProcessSession
    registry = ProcessRegistry()
    session = ProcessSession(id='proc-watch', command='owned', task_id='task',
        session_key='agent:main:local:dm:owned', parent_session_id='parent')
    session.watch_patterns = ['READY']
    registry._check_watch_patterns(session, 'READY\n')
    first = registry.completion_queue.get_nowait()
    session._watch_cooldown_until = 0
    registry._check_watch_patterns(session, 'READY\n')
    second = registry.completion_queue.get_nowait()
    registry._emit_watch_disabled(session, 0, 'test cap')
    disabled = registry.completion_queue.get_nowait()
    identity = GatewayRunner._completion_delivery_identity(first)
    assert identity is not None
    assert identity == GatewayRunner._completion_delivery_identity(json.loads(json.dumps(first)))
    assert identity != GatewayRunner._completion_delivery_identity(second)
    assert GatewayRunner._completion_delivery_identity(disabled) not in (None, identity)
    assert all(e['parent_session_id'] == session.parent_session_id for e in (first, second, disabled))
    from tui_gateway.session_notifications import _notification_event_dedup_key
    assert _notification_event_dedup_key(first) == _notification_event_dedup_key(json.loads(json.dumps(first)))
    assert _notification_event_dedup_key(first) != _notification_event_dedup_key(second)
