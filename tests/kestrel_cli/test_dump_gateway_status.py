# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""``hermes dump`` gateway line for a supervised gateway with no scannable PID (#125390)."""

from __future__ import annotations

from kestrel_cli.dump import _gateway_status
from kestrel_cli.gateway import GatewayRuntimeSnapshot


def test_s6_supervised_gateway_without_pid_is_running_not_unknown(monkeypatch):
    """s6 service up, empty process scan: ``running (...)`` — not an IndexError swallowed into ``unknown``."""
    snapshot = GatewayRuntimeSnapshot(
        manager="s6 (container supervisor)", service_installed=True, service_running=True, gateway_pids=())
    monkeypatch.setattr("hermes_cli.gateway.get_gateway_runtime_snapshot", lambda: snapshot)
    assert _gateway_status() == "running (s6 (container supervisor))"
