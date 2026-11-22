# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

import kestrel_yaml as yaml
from tools import approval


def test_legacy_string_allowlist_recovers_only_string_lists(tmp_path, monkeypatch, caplog):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    description = "script execution via -e/-c flag"
    for value in ([description], yaml.safe_dump([description])):
        (tmp_path / "config.yaml").write_text(yaml.safe_dump({"command_allowlist": value}))
        assert approval.load_permanent_allowlist() == {description}
        assert approval.is_approved("probe", description)
    assert "command_allowlist" in caplog.text


def test_malformed_allowlist_does_not_grant_approval(tmp_path, monkeypatch, caplog):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    for value in ("plain text", "[bad", {"not": "a list"}, [True, "candidate"], "[true, candidate]", 42):
        (tmp_path / "config.yaml").write_text(yaml.safe_dump({"command_allowlist": value}))
        assert approval.load_permanent_allowlist() == set()
        assert not approval.is_approved("probe", "candidate")
    assert "command_allowlist" in caplog.text
