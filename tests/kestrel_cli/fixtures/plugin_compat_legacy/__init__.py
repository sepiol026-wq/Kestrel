# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Frozen legacy plugin used by the behavior compatibility suite.

Keep this callback in its old, narrow form: it intentionally predates additive
hook payload fields and does not accept ``**kwargs``.
"""

received_sessions = []


def _on_session_start(*, session_id):
    received_sessions.append(session_id)
    return {"legacy_session_id": session_id}


def register(ctx):
    ctx.register_hook("on_session_start", _on_session_start)
