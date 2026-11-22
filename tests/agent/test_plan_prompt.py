# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Tests for the built-in /plan command (formerly the bundled `plan` skill).

Covers the shared prompt builder (agent.plan_prompt.build_plan_prompt) and the
registry wiring that makes /plan a first-class command on every surface —
CLI, gateway messengers, and TUI. The skill-to-builtin move exists precisely
so /plan survives the Telegram/Discord command-menu caps that trimmed it as
an alphabetical skill entry.
"""

from agent.plan_prompt import build_plan_prompt

class TestBuildPlanPrompt:
    def test_task_is_included_verbatim(self):
        task = "migrate the auth provider to OIDC with zero downtime"
        prompt = build_plan_prompt(task)
        assert task in prompt

class TestPlanRegistryWiring:
    def test_plan_is_registered_and_resolves(self):
        from kestrel_cli.commands import resolve_command

        cmd = resolve_command("plan")
        assert cmd is not None
        assert cmd.name == "plan"
