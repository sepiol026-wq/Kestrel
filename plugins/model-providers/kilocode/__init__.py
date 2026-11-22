# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Kilo Code provider profile."""

from providers import register_provider
from providers.base import ProviderProfile

kilocode = ProviderProfile(
    name="kilocode", aliases=("kilo-code", "kilo", "kilo-gateway"), env_vars=("KILOCODE_API_KEY",),
    base_url="https://api.kilo.ai/api/gateway", default_aux_model="google/gemini-3.6-flash",
)

register_provider(kilocode)
