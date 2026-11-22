# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Completion backlogs preserve results without multiplying autonomous turns."""
from evals.completion_backlog_probe import probe


def test_ready_completions_share_one_turn_across_interactive_routes(tmp_path):
    for surface in ("cli", "poller", "post-turn"):
        for scenario in ("backlog", "single", "mixed"):
            result = probe(surface, scenario, tmp_path / surface / scenario)
            assert result["wire_turns"] == (5 if scenario == "mixed" else 1), result
            assert result["payload_order"] == sorted(result["payload_order"]), result
            if scenario == "mixed":
                assert result["delegation_delivered_once"], result
            assert result["all_payloads_preserved"], result
            if scenario == "single":
                assert result["single_exact"], result


def test_consumed_or_foreign_completions_never_start_a_turn(tmp_path):
    for surface in ("cli", "poller", "post-turn"):
        for scenario in ("consumed", "foreign"):
            result = probe(surface, scenario, tmp_path / surface / scenario)
            assert result["wire_turns"] == 0, result
            if scenario == "foreign":
                assert result["queue_remaining"] == result["children"], result
