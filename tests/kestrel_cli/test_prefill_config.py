# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Regression tests for CLI prefill config key compatibility."""

from __future__ import annotations

import cli


def test_resolve_prefill_messages_file_uses_top_level(monkeypatch):
    monkeypatch.delenv("HERMES_PREFILL_MESSAGES_FILE", raising=False)

    assert cli._resolve_prefill_messages_file(
        {
            "prefill_messages_file": "top.json",
            "agent": {"prefill_messages_file": "legacy.json"},
        }
    ) == "top.json"


def test_resolve_prefill_messages_file_accepts_legacy_agent_key(monkeypatch):
    monkeypatch.delenv("HERMES_PREFILL_MESSAGES_FILE", raising=False)

    assert cli._resolve_prefill_messages_file(
        {"agent": {"prefill_messages_file": "legacy.json"}}
    ) == "legacy.json"


def test_resolve_prefill_messages_file_prefers_env(monkeypatch):
    monkeypatch.setenv("HERMES_PREFILL_MESSAGES_FILE", "env.json")

    assert cli._resolve_prefill_messages_file(
        {
            "prefill_messages_file": "top.json",
            "agent": {"prefill_messages_file": "legacy.json"},
        }
    ) == "env.json"
