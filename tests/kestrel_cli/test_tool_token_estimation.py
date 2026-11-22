# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Tests for tool token estimation and curses_ui status_fn support."""

# ─── Curses UI Status Bar Tests ──────────────────────────────────────────────

def test_curses_checklist_numbered_fallback_shows_status(monkeypatch, capsys):
    """The numbered fallback should print the status_fn output."""
    from kestrel_cli.curses_ui import _numbered_fallback

    def my_status(chosen):
        return f"Selected {len(chosen)} items"

    # Simulate user pressing Enter immediately (empty input → confirm)
    monkeypatch.setattr("builtins.input", lambda _prompt="": "")

    result = _numbered_fallback(
        "Test title",
        ["Item A", "Item B", "Item C"],
        {0, 2},
        {0, 2},
        status_fn=my_status,
    )

    captured = capsys.readouterr()
    assert "Selected 2 items" in captured.out
    assert result == {0, 2}

# ─── Registry get_schema Tests ───────────────────────────────────────────────
