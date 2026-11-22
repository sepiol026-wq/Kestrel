# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Recovery refuses corrupted metadata and never overwrites unrelated config."""
import json

import pytest

from pm.environments import install_state_dir
from kestrel_cli.runtime_state import recover_publication, runtime_lock


def test_invalid_journal_cannot_write_outside_home(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "home"))
    repo = tmp_path / "repo"
    outside = tmp_path / "outside" / "config.yaml"
    outside.parent.mkdir()
    outside.write_text("untouched")
    state = install_state_dir(repo)
    state.mkdir(parents=True)
    journal = state / "publication.json"
    journal.write_text(json.dumps({"config": str(outside), "previous": "eA==", "facts_before": None}))
    with runtime_lock(repo), pytest.raises(RuntimeError, match="outside Hermes state"):
        recover_publication(repo)
    assert outside.read_text() == "untouched"
    assert journal.exists()
