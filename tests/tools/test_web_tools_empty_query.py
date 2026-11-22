# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""An empty ``web_search`` query is refused before any backend is called."""
import json

import pytest

import tools.web_tools
from tools.registry import registry

assert tools.web_tools.web_search_tool  # importing registers web_search


@pytest.mark.parametrize("args", [{"query": ""}, {"query": "   "}])
def test_empty_query_is_refused_without_calling_a_provider(args, monkeypatch):
    def _no_provider(*_a, **_k):
        raise AssertionError("an empty query must not reach a search provider")

    monkeypatch.setattr("tools.web_tools._memoized_search", _no_provider)
    result = json.loads(registry.dispatch("web_search", args))
    assert result["success"] is False
    assert "non-empty 'query'" in result["error"]
