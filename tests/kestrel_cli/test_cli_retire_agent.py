# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""The interactive CLI must release the old AIAgent's LLM clients when it drops the instance
for a rebuild (/personality, /reasoning, /fast, model/route/credential change, MoA one-shot):
on the codex_app_server route the app-server child belongs to that instance and ``self.agent =
None`` alone orphans it for the CLI process lifetime (#72548)."""

from types import SimpleNamespace
from unittest.mock import patch

from kestrel_cli.cli_commands_mixin import CLICommandsMixin


class _FakeAgent:
    def __init__(self):
        self.release_calls = 0

    def release_clients(self):
        self.release_calls += 1


def test_reasoning_command_releases_old_agent_clients_before_rebuild():
    agent = _FakeAgent()
    stub = SimpleNamespace(reasoning_config={"enabled": True, "effort": "medium"}, show_reasoning=False, agent=agent)
    with patch("cli.save_config_value"), patch("cli._cprint"):
        CLICommandsMixin._handle_reasoning_command(stub, "/reasoning high")
    assert stub.reasoning_config == {"enabled": True, "effort": "high"}
    assert stub.agent is None
    assert agent.release_calls == 1
