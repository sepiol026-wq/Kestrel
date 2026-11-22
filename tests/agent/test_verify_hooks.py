# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Unit tests for the verification-loop policy (agent/verify_hooks.py).

The `pre_verify` user-hook aggregation lives in `hermes_cli.plugins`
(`get_pre_verify_continue_message`) and is tested in
`tests/hermes_cli/test_plugins.py`, alongside `get_pre_tool_call_block_message`.
"""

from __future__ import annotations

from agent import verify_hooks


class TestMaxVerifyNudges:
    def test_default_when_unset(self):
        assert (
            verify_hooks.max_verify_nudges({})
            == verify_hooks.DEFAULT_MAX_VERIFY_NUDGES
        )
        assert (
            verify_hooks.max_verify_nudges({"agent": {}})
            == verify_hooks.DEFAULT_MAX_VERIFY_NUDGES
        )

    def test_reads_and_coerces(self):
        assert verify_hooks.max_verify_nudges({"agent": {"max_verify_nudges": 5}}) == 5
        assert verify_hooks.max_verify_nudges({"agent": {"max_verify_nudges": "2"}}) == 2
        assert verify_hooks.max_verify_nudges({"agent": {"max_verify_nudges": -1}}) == 0

    def test_bad_value_falls_back(self):
        assert (
            verify_hooks.max_verify_nudges({"agent": {"max_verify_nudges": "x"}})
            == verify_hooks.DEFAULT_MAX_VERIFY_NUDGES
        )


class TestCodingVerifyGuidance:
    def test_enabled_by_default(self):
        assert (
            verify_hooks.coding_verify_guidance({})
            == verify_hooks.CODING_VERIFY_GUIDANCE
        )
        assert (
            verify_hooks.coding_verify_guidance({"agent": {}})
            == verify_hooks.CODING_VERIFY_GUIDANCE
        )

    def test_reads_truthy_config(self):
        cfg = {"agent": {"verify_guidance": "yes"}}
        assert verify_hooks.coding_verify_guidance(cfg) == verify_hooks.CODING_VERIFY_GUIDANCE

    def test_opt_out_via_config(self):
        off = {"agent": {"verify_guidance": False}}
        assert verify_hooks.coding_verify_guidance(off) is None
