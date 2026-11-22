# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Tests for _coalesce_session_name_args — multi-word session name merging."""

from kestrel_cli.main import _coalesce_session_name_args


def _active_provider(monkeypatch, tmp_path, *, with_cli):
    import plugins.memory as memory_pkg

    provider_dir = tmp_path / "somemem"
    provider_dir.mkdir()
    if with_cli:
        (provider_dir / "cli.py").write_text("def register_cli(subparser):\n    pass\n", encoding="utf-8")
    monkeypatch.setattr(memory_pkg, "_get_active_memory_provider", lambda: "somemem")
    monkeypatch.setattr(memory_pkg, "find_provider_dir", lambda name: provider_dir if name == "somemem" else None)


def test_the_active_memory_providers_command_ends_a_session_name(monkeypatch, tmp_path):
    """``hermes <provider>`` is registered by the active memory provider, not hardcoded in core."""
    _active_provider(monkeypatch, tmp_path, with_cli=True)
    assert _coalesce_session_name_args(["chat", "somemem"]) == ["chat", "somemem"]  # no -c: untouched
    assert _coalesce_session_name_args(["-c", "my", "session", "somemem", "sync"]) == [
        "-c", "my session", "somemem", "sync"]


def test_a_provider_without_a_cli_is_part_of_the_session_name(monkeypatch, tmp_path):
    """A provider that ships no ``cli.py`` registers no ``hermes <name>``, so its name is just a word."""
    _active_provider(monkeypatch, tmp_path, with_cli=False)
    assert _coalesce_session_name_args(["-c", "my", "somemem", "notes"]) == ["-c", "my somemem notes"]


class TestCoalesceSessionNameArgs:
    """Ensure unquoted multi-word session names are merged into one token."""

    # ── -c / --continue ──────────────────────────────────────────────────

    def test_continue_multiword_unquoted(self):
        """hermes -c Pokemon Agent Dev → -c 'Pokemon Agent Dev'"""
        assert _coalesce_session_name_args(
            ["-c", "Pokemon", "Agent", "Dev"]
        ) == ["-c", "Pokemon Agent Dev"]


    # ── -r / --resume ────────────────────────────────────────────────────


    # ── combined flags ───────────────────────────────────────────────────


    # ── passthrough (no session flags) ───────────────────────────────────

    def test_no_session_flags_passthrough(self):
        """hermes -w chat -q hello (nothing to merge)"""
        result = _coalesce_session_name_args(["-w", "chat", "-q", "hello"])
        assert result == ["-w", "chat", "-q", "hello"]


    # ── subcommand boundary ──────────────────────────────────────────────


    def test_stops_at_setup_subcommand(self):
        """hermes -c my setup → 'setup' is a subcommand, not part of name"""
        assert _coalesce_session_name_args(
            ["-c", "my", "setup"]
        ) == ["-c", "my", "setup"]
