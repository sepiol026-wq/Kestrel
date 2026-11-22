# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Tests for per-slot max_tokens in MoA reference calls.

Verifies that a ``max_tokens`` field on a reference slot dict takes
precedence over the preset-level ``reference_max_tokens``, and that
slot-level max_tokens=None falls back to the preset-level cap.
"""

from __future__ import annotations

from unittest.mock import MagicMock, patch

class TestRunReferenceSlotMaxTokens:
    """Legacy slot settings cannot override internal advisor task budgets."""

    def test_legacy_slot_max_tokens_cannot_override_internal_budget(self):
        """An explicit internal caller budget wins over a stale user setting."""
        from agent.moa_loop import _run_reference

        captured_kwargs: dict = {}

        def fake_call_llm(**kwargs):
            captured_kwargs.update(kwargs)
            mock_resp = MagicMock()
            mock_resp.choices = [MagicMock(message=MagicMock(content="advice"))]
            mock_resp.usage = None
            return mock_resp

        slot = {"provider": "openrouter", "model": "deepseek/deepseek-v4-pro", "max_tokens": 600}

        with patch("agent.moa_loop._slot_runtime", return_value={"provider": "openrouter", "model": "deepseek/deepseek-v4-pro"}), \
             patch("agent.moa_loop.call_llm", side_effect=fake_call_llm), \
             patch("agent.moa_loop._maybe_apply_moa_cache_control", side_effect=lambda msgs, rt, **kwargs: msgs):
            _run_reference(slot, [{"role": "user", "content": "hi"}], max_tokens=2000)

        assert captured_kwargs.get("max_tokens") == 2000
