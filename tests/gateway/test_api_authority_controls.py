# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Run controls are fenced to the exact canonical admission."""
from tests.gateway.test_api_authority_execution import _probe


def test_run_stop_cancels_only_its_queued_admission(tmp_path):
    _probe(tmp_path, runs="controls")
