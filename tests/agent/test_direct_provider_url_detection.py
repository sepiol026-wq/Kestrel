# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

from __future__ import annotations

from run_agent import AIAgent


def _agent_with_base_url(base_url: str) -> AIAgent:
    agent = object.__new__(AIAgent)
    agent.base_url = base_url
    return agent


def test_direct_openai_url_requires_openai_host():
    agent = _agent_with_base_url("https://api.openai.com.example/v1")

    assert agent._is_direct_openai_url() is False




def test_direct_openai_url_accepts_native_host():
    agent = _agent_with_base_url("https://api.openai.com/v1")

    assert agent._is_direct_openai_url() is True
