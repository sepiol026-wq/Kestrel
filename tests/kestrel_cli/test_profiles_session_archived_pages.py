# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Archived profile pages count archived rows even when live pins back-fill."""

from starlette.testclient import TestClient


def test_archived_profiles_pages_do_not_lose_rows_to_non_archived_pins(_isolate_kestrel_home, monkeypatch):
    import kestrel_state
    from kestrel_constants import get_kestrel_home
    from kestrel_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN
    from kestrel_state import SessionDB

    monkeypatch.setattr(hermes_state, "DEFAULT_DB_PATH", get_kestrel_home() / "state.db")
    client = TestClient(app)
    client.headers[_SESSION_HEADER_NAME] = _SESSION_TOKEN

    db = SessionDB()
    try:
        for sid in ("archive-a", "archive-b"):
            db.create_session(session_id=sid, source="cli")
            db.append_message(session_id=sid, role="user", content="hi")
            db.set_session_archived(sid, True)
        db.create_session(session_id="live-pin", source="cli")
        db.append_message(session_id="live-pin", role="user", content="hi")
        db.set_session_pinned("live-pin", True)
    finally:
        db.close()

    for route in ("/api/profiles/sessions?profile=default", "/api/sessions?profile=default"):
        pages = [client.get(f"{route}&limit=1&offset={offset}&archived=only") for offset in (0, 1)]
        assert all(response.status_code == 200 for response in pages)
        assert [response.json()["total"] for response in pages] == [2, 2]
        assert {row["id"] for response in pages for row in response.json()["sessions"] if row["archived"]} == {"archive-a", "archive-b"}
        # Desktop keeps the first limit rows plus pins. Backfill must follow
        # the archived window or that trim discards an archived row forever.
        assert all(response.json()["sessions"][0]["archived"] for response in pages)
        assert all(any(row["id"] == "live-pin" for row in response.json()["sessions"]) for response in pages)
