# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Regression coverage for profile scope on abandoned-turn reaper threads."""

import threading
from types import SimpleNamespace

from gateway.run_agent_cache import GatewayAgentCacheMixin
from kestrel_constants import (
    get_kestrel_home,
    reset_kestrel_home_override,
    set_kestrel_home_override,
)
from tools.process_registry import process_registry


class _RunningAgent:
    _gateway_turn_process_task_id = "served-session"
    _gateway_turn_process_baseline = frozenset({"proc_existing"})

    def interrupt(self, *_args, **_kwargs):
        return None


class _Runner:
    def __init__(self):
        self._state = SimpleNamespace(turn=SimpleNamespace(agent=_RunningAgent()))

    def _peek_session_state(self, _session_key):
        return self._state

    def _invalidate_session_run_generation(self, _session_key, *, reason):
        assert reason == "test"
        return 7

    def _is_session_run_current(self, _session_key, generation):
        return generation == 7


def test_interrupt_reaper_keeps_served_profile_home(tmp_path, monkeypatch):
    """A /stop-style reaper must write/check process state in the session's profile, not launch home."""
    launch_home = tmp_path / "launch"
    served_home = tmp_path / "served"
    launch_home.mkdir()
    served_home.mkdir()
    monkeypatch.setenv("HERMES_HOME", str(launch_home))

    seen_homes = []
    reaped = threading.Event()

    def _record_reap(_task_id, _baseline, *, source):
        assert source == "gateway_turn_interrupt"
        seen_homes.append(get_kestrel_home())
        reaped.set()
        return 0

    monkeypatch.setattr(process_registry, "kill_started_since", _record_reap)

    token = set_kestrel_home_override(served_home)
    try:
        GatewayAgentCacheMixin._interrupt_running_turn(
            _Runner(),
            "served-session",
            interrupt_reason="test interrupt",
            invalidation_reason="test",
        )
        assert reaped.wait(timeout=1.0), "reaper thread did not run"
    finally:
        reset_kestrel_home_override(token)

    assert seen_homes == [served_home]
