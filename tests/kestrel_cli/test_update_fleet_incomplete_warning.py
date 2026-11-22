# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Incomplete-fleet-restart hint on a systemd host (Linux arm of
``_warn_incomplete_gateway_fleet_restart``; the macOS arm lives in
test_update_launchd_fleet_restart.py). Regression for #111866: this class used to
sit in the launchd file, where it asserted the non-macOS branch under a faked
``is_macos()`` — green on Linux, never run on macOS, wrong on both."""

from __future__ import annotations

import pytest

from kestrel_cli.update_cmd_fleet import _warn_incomplete_gateway_fleet_restart

pytestmark = pytest.mark.platforms("linux")


def test_launchd_labels_get_launchctl_hint(capsys):
    _warn_incomplete_gateway_fleet_restart(["ai.hermes.gateway-merit-ops"])
    out = capsys.readouterr().out
    assert "Update incomplete" in out
    assert "launchctl kickstart -k" in out


def test_systemd_units_keep_systemctl_hint(capsys):
    _warn_incomplete_gateway_fleet_restart(["hermes-gateway-coder"])
    out = capsys.readouterr().out
    assert "systemctl" in out
    assert "launchctl" not in out
