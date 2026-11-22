# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""GitHub/Copilot Responses reasoning fields on the Codex transport.

Regression for #46527: the GitHub Responses branch must request ``summary: "auto"`` so
Copilot returns reasoning text. Without it, reasoning items come back with no summary and
Hermes persists no reasoning/thinking content.
"""

import pytest

from agent.transports import get_transport


@pytest.fixture
def transport():
    import agent.transports.codex
    return get_transport("codex_responses")


def test_github_responses_requests_reasoning_summary(transport):
    kw = transport.build_kwargs(
        model="gpt-5.4", messages=[{"role": "user", "content": "Hi"}], tools=[],
        base_url="https://api.githubcopilot.com",
        profile_reasoning={"effort": "medium"},
    )
    assert kw.get("reasoning") == {"effort": "medium", "summary": "auto"}
