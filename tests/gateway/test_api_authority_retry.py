# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Busy API retries observe one committed execution."""
from tests.gateway.test_api_authority_execution import _probe


def test_api_busy_fifo_retries_observe_one_durable_result(tmp_path):
    _probe(tmp_path, advanced=True)
