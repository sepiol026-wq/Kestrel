# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""The hand-off suite, HEAD to NEXT.

A HEAD install made by ``scripts/install.sh`` updated to NEXT, a synthetic child commit: the
updater under test runs its own restart path end to end.

Every property is a test over one recorded scenario (see ``_scenario.py``).
"""

from __future__ import annotations

import pytest

from tests.e2e.core.upgrade import _helpers as H
from tests.e2e.core.upgrade import _install_helpers as I
from tests.e2e.core.upgrade.handoff._scenario import HandoffProperties

pytestmark = [
    pytest.mark.skipif(not H.BWRAP_OK, reason="bubblewrap sandbox unavailable"),
    pytest.mark.skipif(I.real_uv() is None, reason="uv required"),
    pytest.mark.live_system_guard_bypass,  # one bwrap sandbox per column; killing it reaps everything
]


class TestFromHead(HandoffProperties):
    column = "head"
