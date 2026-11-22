# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Regression test: `hermes backup -o <bad path>` errors cleanly (round-3 SUB-01).

Before, an unwritable/nonexistent-parent output path raised a raw
PermissionError traceback from the unguarded is_dir()/mkdir() calls. It must
print a one-line error and exit 1 instead.
"""

from argparse import Namespace

import pytest


def _make_home(tmp_path, monkeypatch):
    home = tmp_path / ".hermes"
    home.mkdir()
    (home / "config.yaml").write_text("model: {}\n")
    monkeypatch.setenv("HERMES_HOME", str(home))
    return home


def test_backup_unwritable_parent_errors_cleanly(tmp_path, monkeypatch, capsys):
    _make_home(tmp_path, monkeypatch)
    import kestrel_cli.backup as backup_mod

    # A parent directory that cannot be created (a file stands where the dir
    # would go) reliably triggers an OSError on mkdir without needing root.
    blocker = tmp_path / "blocker"
    blocker.write_text("i am a file, not a dir")
    bad_out = blocker / "sub" / "backup.zip"

    with pytest.raises(SystemExit) as exc:
        backup_mod.run_backup(Namespace(output=str(bad_out)))

    assert exc.value.code == 1
    out = capsys.readouterr().out
    assert "Traceback" not in out
