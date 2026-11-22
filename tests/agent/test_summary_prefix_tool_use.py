# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Regression tests for the SUMMARY_PREFIX tool-use clause (#65848 class).

The REFERENCE ONLY framing must keep its anti-resumption protections while
explicitly NOT restricting tool use — the strong wording was observed bleeding
into general tool-use suppression (narration-only turns after compression).
"""

from agent.context_compressor import (
    _HISTORICAL_SUMMARY_PREFIXES,
    SUMMARY_PREFIX,
)


class TestSummaryPrefixToolUseClause:




    def test_strip_recognizes_current_and_frozen_prefixes(self):
        """Re-compaction normalization must strip both the live prefix and the
        newly frozen one (the incident generation)."""
        from agent.context_compressor import ContextCompressor

        for prefix in (SUMMARY_PREFIX, _HISTORICAL_SUMMARY_PREFIXES[0]):
            text = f"{prefix}\nsummary body here"
            stripped = ContextCompressor._strip_summary_prefix(text)
            assert "summary body here" in stripped
            assert "REFERENCE ONLY" not in stripped
