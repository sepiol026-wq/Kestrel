# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""SearXNG search-only plugin — bundled, auto-loaded (``SEARXNG_URL``)."""
from __future__ import annotations
from plugins.web.searxng.provider import SearXNGWebSearchProvider


def register(ctx) -> None:
    ctx.register_web_search_provider(SearXNGWebSearchProvider())
