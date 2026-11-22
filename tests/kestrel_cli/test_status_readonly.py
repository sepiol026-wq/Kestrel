# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Status must not bootstrap the session writer it merely observes."""

import json
from types import SimpleNamespace

import pytest


@pytest.mark.parametrize("legacy", [False, True])
def test_session_status_does_not_create_database(tmp_path, monkeypatch, capsys, legacy):
    from kestrel_cli import status

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    monkeypatch.setattr(status, "get_kestrel_home", lambda: tmp_path)
    if legacy:
        directory = tmp_path / "sessions"
        directory.mkdir()
        (directory / "sessions.json").write_text(json.dumps({"fixture": {}}))
    status._render_sessions(SimpleNamespace(config={}))
    output = capsys.readouterr().out
    assert "1 session(s)" in output if legacy else "Active:" in output
    assert not (tmp_path / "state.db").exists()
