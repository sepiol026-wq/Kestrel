# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Perplexity web search + snippets plugin — bundled, auto-loaded.

Backed by the Perplexity Search API over httpx. Both search and extract are
sync; the dispatcher in :mod:`tools.web_tools` handles the wrap when the
caller is async.
"""

from __future__ import annotations

from plugins.web.perplexity.provider import PerplexityWebSearchProvider


def register(ctx) -> None:
    """Register the Perplexity provider with the plugin context."""
    ctx.register_web_search_provider(PerplexityWebSearchProvider())
