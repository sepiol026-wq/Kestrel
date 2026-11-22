# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

from agent.chat_completion_helpers import _validated_openrouter_provider_sort


def test_validated_openrouter_provider_sort_accepts_valid_values():
    assert _validated_openrouter_provider_sort("price") == "price"
    assert _validated_openrouter_provider_sort(" latency ") == "latency"
    assert _validated_openrouter_provider_sort("THROUGHPUT") == "throughput"


def test_validated_openrouter_provider_sort_rejects_invalid_values():
    assert _validated_openrouter_provider_sort("intelligence") is None
    assert _validated_openrouter_provider_sort("") is None
    assert _validated_openrouter_provider_sort(None) is None
