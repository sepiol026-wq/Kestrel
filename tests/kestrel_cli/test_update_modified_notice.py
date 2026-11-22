# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Skill sync keeps user edits and tells the updater's user how to inspect them."""

from tools import skills_sync
from kestrel_cli.update_cmd_maint import _print_bundled_skills_sync_report


def test_kept_skill_edits_have_an_actionable_update_report(tmp_path, monkeypatch, capsys):
    bundled = tmp_path / "bundled"
    source = bundled / "example/SKILL.md"
    source.parent.mkdir(parents=True)
    source.write_text("---\nname: example\ndescription: fixture\n---\nOriginal\n", encoding="utf-8")
    installed = tmp_path / "skills"
    monkeypatch.setattr(skills_sync, "SKILLS_DIR", installed)
    monkeypatch.setattr(skills_sync, "MANIFEST_FILE", installed / ".manifest.json")
    monkeypatch.setattr(skills_sync, "_get_bundled_dir", lambda: bundled)
    monkeypatch.setattr(skills_sync, "_get_optional_dir", lambda: tmp_path / "optional")
    monkeypatch.setattr("agent.skill_utils.get_external_skills_dirs", list)

    _print_bundled_skills_sync_report()
    user_skill = installed / "example/SKILL.md"
    assert user_skill.read_text(encoding="utf-8") == source.read_text(encoding="utf-8")
    assert "list-modified" not in capsys.readouterr().out
    user_skill.write_text("My local instructions\n", encoding="utf-8")
    source.write_text(source.read_text(encoding="utf-8") + "Upstream revision\n", encoding="utf-8")

    _print_bundled_skills_sync_report()
    out = capsys.readouterr().out
    assert "1 user-modified (kept)" in out
    assert "hermes skills list-modified" in out
    assert user_skill.read_text(encoding="utf-8") == "My local instructions\n"