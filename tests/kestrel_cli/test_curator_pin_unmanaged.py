# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Pin/unpin messaging on unmanaged skills (#92993).

`hermes curator pin <name>` on an unmanaged skill (curation-eligible but no
`created_by` marker — the pre-marker population `list-unmanaged` shows) used
to print "will bypass auto-transitions" and exit 0. But `curated_report()`
only walks marker-carrying skills, so auto-transitions never consider an
unmanaged skill at all: the pin is recorded yet inert, and the message
claimed an effect that does not exist. The fix keeps the write (the flag
becomes meaningful after `hermes curator adopt`) and makes the message say
what actually happened.
"""

from __future__ import annotations

from types import SimpleNamespace


def _ns(skill: str) -> SimpleNamespace:
    return SimpleNamespace(skill=skill)


def _stub(monkeypatch, *, managed: bool):
    """Point the CLI at stubbed skill_usage surfaces.

    ``managed`` drives ``is_curator_managed`` — the policy flag the new
    branch reads. ``is_agent_created`` stays True so the existing bundled/
    hub refusal guard passes and the code reaches the managed check.
    """
    from tools import skill_usage

    calls: list[tuple[str, bool]] = []
    monkeypatch.setattr(skill_usage, "is_agent_created", lambda name: True)
    monkeypatch.setattr(skill_usage, "is_curator_managed", lambda name: managed)
    monkeypatch.setattr(
        skill_usage,
        "set_pinned",
        # Combined #93149 + #93002 semantics: set_pinned() returns True when
        # the write landed; the stub records the call and reports success.
        lambda name, pinned: (calls.append((name, pinned)), True)[1],
    )
    return calls








def test_pin_still_refuses_bundled_skills(monkeypatch, capsys):
    import kestrel_cli.curator as curator_cli
    from tools import skill_usage

    calls = _stub(monkeypatch, managed=True)
    # _stub leaves is_agent_created True; override AFTER so the refusal
    # guard fires before the managed check.
    monkeypatch.setattr(skill_usage, "is_agent_created", lambda name: False)

    rc = curator_cli._cmd_pin(_ns("bundled-skill"))

    assert rc == 1
    assert calls == []
    assert "cannot pin" in capsys.readouterr().out
