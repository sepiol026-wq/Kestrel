# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""``memory.provider`` set to a core sentinel (``builtin``/``default``/``none``) names the built-in
store, not a plugin: doctor and the provider migration must not report it as missing (#75647, #115113)."""

from pathlib import Path

import pytest

from kestrel_cli import doctor, doctor_state
from kestrel_cli import memory_provider_migration as mig


@pytest.mark.parametrize("sentinel", ["builtin", "Default", "none"])
def test_doctor_treats_core_sentinel_as_builtin_memory(tmp_path: Path, monkeypatch, capsys, sentinel):
    (tmp_path / "config.yaml").write_text(f"memory:\n  provider: {sentinel}\n")
    monkeypatch.setattr(doctor, "HERMES_HOME", tmp_path)

    finding = doctor_state._check_memory_provider(False)
    out = capsys.readouterr().out

    assert "Built-in memory active" in out
    assert "plugin not found" not in out
    assert finding.issues == []


def test_migration_never_installs_a_core_sentinel(tmp_path: Path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    (tmp_path / "config.yaml").write_text("memory:\n  provider: builtin\n")
    monkeypatch.setattr(mig, "catalog_source", lambda name: pytest.fail("catalog must not be consulted"))
    said: list[str] = []

    assert mig.migrate_home(tmp_path, install=lambda n: pytest.fail("must not install"), say=said.append) is None
    assert said == []
