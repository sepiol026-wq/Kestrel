# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""`hermes sessions export` single-file formats accept a directory as OUTPUT."""

import json
import sys

import kestrel_state
import kestrel_cli.main as main_mod


class _FakeDB:
    def resolve_session_id(self, session_id):
        return "sess-123"

    def export_session(self, session_id, **_projection):
        return {"id": "sess-123", "source": "cli", "messages": [{"role": "user", "content": "hi"}]}

    def assert_exports_safe(self, session_ids, max_messages=None):
        return None

    def close(self):
        pass


def _export(monkeypatch, *argv):
    # Read-only observation commands short-circuit when state.db is absent; the fake DB
    # stands in for the file that would otherwise be opened read-only.
    from kestrel_constants import get_kestrel_home
    (get_kestrel_home() / "state.db").touch()
    monkeypatch.setattr(hermes_state, "SessionDB", lambda **_kw: _FakeDB())
    monkeypatch.setattr(sys, "argv", ["hermes", "sessions", "export", "--session-id", "sess", *argv])
    main_mod.main()


def test_jsonl_export_into_directory_writes_default_named_file(monkeypatch, tmp_path):
    out_dir = tmp_path / "saved"
    out_dir.mkdir()

    _export(monkeypatch, f"{out_dir}/")

    written = out_dir / "hermes_session_sess-123.jsonl"
    assert json.loads(written.read_text(encoding="utf-8"))["id"] == "sess-123"


def test_jsonl_export_to_file_path_is_unchanged(monkeypatch, tmp_path):
    target = tmp_path / "one.jsonl"

    _export(monkeypatch, str(target))

    assert json.loads(target.read_text(encoding="utf-8"))["id"] == "sess-123"
    assert target.is_file() and not (tmp_path / "hermes_session_sess-123.jsonl").exists()
