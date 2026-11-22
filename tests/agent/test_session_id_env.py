# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Test that HERMES_SESSION_ID is exposed as an env var and ContextVar."""

import os
import sys

import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../.."))

from run_agent import AIAgent


@pytest.fixture(autouse=True)
def _cleanup_env():
    """Remove HERMES_SESSION_ID before/after each test."""
    os.environ.pop("HERMES_SESSION_ID", None)
    yield
    os.environ.pop("HERMES_SESSION_ID", None)




def test_session_id_env_uses_provided_id():
    """When session_id is passed explicitly, HERMES_SESSION_ID reflects it."""
    custom_id = "20260511_120000_abc12345"
    agent = AIAgent(
        api_key="test-key",
        base_url="https://openrouter.ai/api/v1",
        session_id=custom_id,
        quiet_mode=True,
        skip_context_files=True,
        skip_memory=True,
    )
    assert os.environ["HERMES_SESSION_ID"] == custom_id
    assert agent.session_id == custom_id


