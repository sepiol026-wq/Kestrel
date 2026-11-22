# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Internal turns preserve the user activity clock."""
import json
from datetime import datetime, timedelta

from gateway.config import GatewayConfig, Platform
from gateway.session import SessionSource, SessionStore


def test_internal_turn_does_not_advance_activity_clock(tmp_path):
    store = SessionStore(tmp_path / "sessions", GatewayConfig())
    source = SessionSource(platform=Platform.TELEGRAM, chat_id="123", user_id="u1")
    entry = store.get_or_create_session(source)
    prior_activity = datetime.now() - timedelta(minutes=10)
    entry.updated_at = prior_activity
    store._save()

    reused = store.get_or_create_session(source, touch_activity=False)
    store.update_session(
        reused.session_key,
        last_prompt_tokens=123,
        touch_activity=False,
    )

    assert reused.session_id == entry.session_id
    assert reused.updated_at == prior_activity
    assert reused.last_prompt_tokens == 123
    rows = store._db.load_gateway_routing_entries(
        scope=store._routing_scope()
    )
    durable = json.loads(rows[reused.session_key])
    assert durable["updated_at"] == prior_activity.isoformat()
    assert durable["last_prompt_tokens"] == 123
