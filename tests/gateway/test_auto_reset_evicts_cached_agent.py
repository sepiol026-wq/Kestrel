# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Auto-reset is a full conversation boundary: per-session caches must not
survive it (#58403)."""
from __future__ import annotations

from gateway import run as gateway_run


def test_auto_reset_cleanup_clears_last_resolved_model():
    """Regression test for #58403.

    Auto-reset is a full conversation boundary and now routes through the
    `_clear_conversation_scope` funnel. The funnel must clear
    the session's `last_resolved_model` — without it, the fresh auto-reset session could
    serve a model cached before the reset on a transient config-cache miss.
    Behavioral: exercises the real funnel instead of pinning source shape.
    """
    runner = object.__new__(gateway_run.GatewayRunner)
    key = "agent:main:telegram:dm:58403"
    runner._session_state(key).conversation.last_resolved_model = "stale/model"
    runner._session_state("other").conversation.last_resolved_model = "keep/me"
    runner._clear_conversation_scope(key, reason="auto_reset")
    assert not runner._session_state(key).conversation.last_resolved_model, (
        "the conversation-boundary funnel must pop the session's entry from "
        "`last_resolved_model` (#58403) — auto-reset routes through it"
    )
    assert runner._session_state("other").conversation.last_resolved_model == "keep/me"
