# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Windows lane teardown: a prompt auto-starts the profile's gateway, which outlives the turn."""

from __future__ import annotations

import contextlib

import pytest

from tests.e2e.core.windows import _helpers as H


@pytest.fixture(autouse=True)
def _stop_auto_started_gateways():
    first = len(H.MADE_HOMES)
    yield
    made, H.MADE_HOMES[first:] = H.MADE_HOMES[first:], []
    for home, since in made:
        if not H.owned_processes(home, since=since):
            continue
        with contextlib.suppress(Exception):
            H.hermes(home, "gateway", "stop", timeout=60)
        H.kill_owned(home, since=since)
