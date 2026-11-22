# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Tests for `hermes curator run` CLI behavior."""

from __future__ import annotations

from types import SimpleNamespace

def _args(**kwargs):
    values = {
        "dry_run": False,
        "synchronous": False,
        "background": False,
    }
    values.update(kwargs)
    return SimpleNamespace(**values)

def test_run_defaults_to_synchronous(monkeypatch, capsys):
    import agent.curator as curator_state
    import kestrel_cli.curator as curator_cli

    calls = []
    monkeypatch.setattr(curator_state, "is_enabled", lambda: True)
    monkeypatch.setattr(
        curator_state,
        "run_curator_review",
        lambda **kwargs: calls.append(kwargs) or {"auto_transitions": {}},
    )

    assert curator_cli._cmd_run(_args()) == 0

    assert calls[0]["synchronous"] is True
    assert calls[0]["dry_run"] is False
    assert "background" not in capsys.readouterr().out
