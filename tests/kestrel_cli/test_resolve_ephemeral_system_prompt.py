# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Unit tests for resolve_ephemeral_system_prompt_from_config."""

from kestrel_cli.config import (
    resolve_ephemeral_system_prompt_from_config,
)

def test_resolve_uses_named_personality_when_set():
    cfg = {
        "display": {"personality": "helpful"},
        "agent": {
            "system_prompt": "manual forever",
            "personalities": {"helpful": "You are helpful."},
        },
    }
    assert resolve_ephemeral_system_prompt_from_config(cfg) == "You are helpful."

def test_resolve_falls_back_to_manual_system_prompt():
    cfg = {
        "display": {"personality": "none"},
        "agent": {
            "system_prompt": "manual forever",
            "personalities": {"helpful": "You are helpful."},
        },
    }
    assert resolve_ephemeral_system_prompt_from_config(cfg) == "manual forever"

def test_resolve_ignores_unknown_personality_name():
    cfg = {
        "display": {"personality": "missing"},
        "agent": {
            "system_prompt": "manual forever",
            "personalities": {"helpful": "You are helpful."},
        },
    }
    assert resolve_ephemeral_system_prompt_from_config(cfg) == "manual forever"

def test_resolve_renders_dict_personality():
    cfg = {
        "display": {"personality": "coder"},
        "agent": {
            "system_prompt": "manual forever",
            "personalities": {
                "coder": {
                    "system_prompt": "You are an expert programmer.",
                    "tone": "technical",
                    "style": "concise",
                }
            },
        },
    }
    resolved = resolve_ephemeral_system_prompt_from_config(cfg)
    assert "You are an expert programmer." in resolved
    assert "Tone: technical" in resolved
    assert "Style: concise" in resolved
