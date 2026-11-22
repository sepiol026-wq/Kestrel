# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Behavior contracts for plugin-guard dangerous-install diagnostics."""

from tools.plugin_guard import should_allow_plugin_install
from tools.skills_guard import Finding, ScanResult


def test_dangerous_reason_counts_and_names_blocking_findings():
    result = ScanResult(
        skill_name="fixture-plugin",
        source="owner/repo",
        trust_level="community",
        verdict="dangerous",
        findings=[
            Finding(
                "hermes_config_mod_shell", "critical", "persistence",
                "runtime/setup.sh", 4, "echo x > config.yaml", "writes config",
            ),
            Finding(
                "unpinned_pip_install", "medium", "supply_chain",
                "README.md", 8, "pip install example", "unpinned dependency",
            ),
            Finding(
                "remote_fetch", "medium", "supply_chain",
                "README.md", 9, "curl https://example.test", "remote fetch",
            ),
        ],
    )

    allowed, reason = should_allow_plugin_install(result)

    assert allowed is False
    assert "hermes_config_mod_shell" in reason
    assert "unpinned_pip_install" not in reason