# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Tests for percentage clamping at 100% across display paths.

PR #3480 capped context pressure percentage at 100% in agent/display.py
but missed the same unclamped pattern in 4 other files. When token counts
overshoot the context length (possible during streaming or before
compression fires), users see >100% in /stats, gateway status, and
memory tool output.
"""












class TestSourceLinesAreClamped:
    def test_gateway_run_clamped(self):
        # The /usage stats handler was extracted from gateway/run.py into
        # gateway/slash_commands.py and then gateway/slash_commands_status.py.
        # Assert the clamp intent behaviourally: the shared ``_pct`` helper every
        # gateway context gauge goes through clamps at 100 and guards a zero window.
        from gateway.slash_commands_status import _pct

        assert _pct(210_000, 200_000) == 100
        assert _pct(30_000, 200_000) == 15
        assert _pct(5, 0) == 0


