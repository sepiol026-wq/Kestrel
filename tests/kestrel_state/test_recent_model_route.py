# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""get_recent_session_model_route picks the newest route deterministically on equal last_seen."""
from kestrel_state import SessionDB


def test_recent_route_tie_on_last_seen_prefers_later_row(tmp_path):
    db = SessionDB(tmp_path / "state.db")
    db.create_session(session_id="s1", source="tui", model="alpha")
    with db._lock:
        for model in ("alpha", "zeta"):
            db._conn.execute(
                "INSERT INTO session_model_usage (session_id, model, billing_provider, task,"
                " api_call_count, last_seen) VALUES ('s1', ?, 'p', '', 1, 100.0)",
                (model,),
            )
        db._conn.commit()

    assert db.get_recent_session_model_route("s1")["model"] == "zeta"
