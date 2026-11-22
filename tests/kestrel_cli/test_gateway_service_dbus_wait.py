# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""``_wait_for_user_dbus_socket``: readiness found on poll_until's final check still exports the env."""

import pytest

pytest.importorskip("pwd")  # POSIX systemd helper, same gate as test_gateway_service

import kestrel_cli.gateway as gateway_cli


def test_ready_only_on_final_check_exports_env_once(monkeypatch):
    calls, slept = [], []
    checks = iter([False, True])
    # Deadline at 1.0. After the first miss the clock reads 0.9, so the last sleep is cut to 0.1
    # and the second check is the final one, made at the deadline.
    clock = iter([0.0, 0.9, 1.0])
    monkeypatch.setattr(gateway_cli, "_ensure_user_systemd_env", lambda: calls.append("env"))
    monkeypatch.setattr(gateway_cli, "_user_systemd_socket_ready", lambda: next(checks))
    monkeypatch.setattr("agent.deadline.time.monotonic", lambda: next(clock))
    monkeypatch.setattr("agent.deadline.time.sleep", slept.append)

    assert gateway_cli._wait_for_user_dbus_socket(timeout=1.0) is True
    assert slept == [pytest.approx(0.1)]
    assert calls == ["env"]
