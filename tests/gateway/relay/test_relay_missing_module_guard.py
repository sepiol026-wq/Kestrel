# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""The relay guard: a missing egress module or parent package is absence; a failure inside it is not."""
from __future__ import annotations

import pytest

from gateway.relay.egress import _is_missing_gateway_relay


@pytest.mark.parametrize("name", ["gateway", "gateway.relay", "gateway.relay.egress"])
def test_relay_guard_reads_a_missing_target_or_parent_as_absence(name):
    assert _is_missing_gateway_relay(ModuleNotFoundError(name=name)) is True


@pytest.mark.parametrize("exc", [
    ModuleNotFoundError(name="gateway.relay.egress.dependency"),
    ModuleNotFoundError(name="gateway.relay.egress_dependency"),
    ModuleNotFoundError(name="requests"),
    ModuleNotFoundError(name=None),
    ImportError(name="gateway.relay.egress"),
])
def test_relay_guard_reads_anything_else_as_a_fault(exc):
    assert _is_missing_gateway_relay(exc) is False
