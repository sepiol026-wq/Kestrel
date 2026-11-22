# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Keenable web search + extract plugin — bundled, auto-loaded; keyless-ring member."""
from __future__ import annotations
from plugins.web.keenable.provider import KeenableWebSearchProvider


def register(ctx) -> None:
    ctx.register_web_search_provider(KeenableWebSearchProvider())
