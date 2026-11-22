# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""OpenAI native web search plugin — bundled, auto-loaded."""

from __future__ import annotations

from plugins.web.openai_native.provider import OpenAINativeWebSearchProvider


def register(ctx) -> None:
    ctx.register_web_search_provider(OpenAINativeWebSearchProvider())
