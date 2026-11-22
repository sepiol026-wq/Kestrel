# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Invariant: session recovery neutralises unparseable ``sessions.model_config``.

``integrity_check`` never looks at column contents, so a source whose JSON was
truncated by the damage recovers "clean" and the recovered store then raises
``OperationalError: malformed JSON`` the first time a caller resumes a parent
session (``reopen_session`` rewrites reset-child markers with ``json_set``).
Both recovery lanes pass through ``_finalize_derived_metadata``, so the reset
belongs there rather than in either lane's copy loop.
"""

from __future__ import annotations

import sqlite3
from pathlib import Path

from kestrel_state import SessionDB
from kestrel_cli.session_recovery import recover_session_database

_TRUNCATED_JSON = '{"model": "sonnet", "cw'


def _damaged_source(path: Path) -> None:
    """A structurally healthy DB whose child row carries truncated model_config JSON."""
    db = SessionDB(db_path=path)
    try:
        db.create_session("parent", "telegram", session_key="telegram:u:c")
        db.append_message("parent", "user", "hello")
        db.end_session("parent", "session_reset")
        db.create_session("child", "telegram", session_key="telegram:u:c", parent_session_id="parent")
    finally:
        db.close()
    raw = sqlite3.connect(str(path))
    try:
        raw.execute("UPDATE sessions SET model_config = ? WHERE id = 'child'", (_TRUNCATED_JSON,))
        raw.commit()
    finally:
        raw.close()


def test_recovery_resets_unparseable_model_config(tmp_path):
    source = tmp_path / "state.db"
    output = tmp_path / "recovered.db"
    _damaged_source(source)

    report = recover_session_database(source, output)

    assert report["verification"]["healthy"], report["verification"]["errors"]

    recovered = SessionDB(db_path=output)
    try:
        # The blob was unrecoverable; what matters is that resuming the parent still works
        # (on base this raises OperationalError: malformed JSON).
        recovered.reopen_session("parent")
    finally:
        recovered.close()
