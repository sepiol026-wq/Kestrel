# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Tests for the CLI `/reasoning full` / `/reasoning clamp` recap toggle.

The post-response "Reasoning" recap box clamps long thinking to the first
10 lines. `/reasoning full` opts into uncapped display (Taelin's "show all
thinking tokens" ask); `/reasoning clamp` restores the 10-line collapse.
These assert the toggle sets the instance flag, persists to config.yaml,
and that the clamp gate honours the flag.
"""

import kestrel_yaml as yaml

from kestrel_cli.cli_commands_mixin import CLICommandsMixin

class _Stub(CLICommandsMixin):
    """Minimal carrier for the attributes `_handle_reasoning_command` reads."""

    def __init__(self):
        self.reasoning_config = None
        self.show_reasoning = True
        self.reasoning_full = False
        self.agent = None

    def _current_reasoning_callback(self):
        return None

def _seed_config(tmp_path, monkeypatch):
    hh = tmp_path / ".hermes"
    hh.mkdir()
    (hh / "config.yaml").write_text("display:\n  show_reasoning: true\n")
    monkeypatch.setenv("HERMES_HOME", str(hh))
    # cli captures _kestrel_home at import; force it to the temp home.
    import cli

    monkeypatch.setattr(cli, "_kestrel_home", hh, raising=False)
    return hh

def test_reasoning_full_sets_and_persists(tmp_path, monkeypatch):
    hh = _seed_config(tmp_path, monkeypatch)
    s = _Stub()

    s._handle_reasoning_command("/reasoning full")
    assert s.reasoning_full is True
    saved = yaml.safe_load((hh / "config.yaml").read_text())
    assert saved["display"]["reasoning_full"] is True
