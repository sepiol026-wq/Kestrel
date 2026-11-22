# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Vercel AI Gateway provider profile: attribution headers + reasoning passthrough."""

from typing import Any

from providers import register_provider
from providers.base import ProviderProfile


class VercelAIGatewayProfile(ProviderProfile):
    """Vercel AI Gateway — attribution headers + reasoning passthrough."""

    def build_api_kwargs_extras(
        self, *, reasoning_config: dict | None = None, supports_reasoning: bool = True, **ctx: Any
    ) -> tuple[dict[str, Any], dict[str, Any]]:
        if not supports_reasoning:
            return {}, {}
        reasoning = dict(reasoning_config) if reasoning_config is not None else {"enabled": True, "effort": "medium"}
        return {"reasoning": reasoning}, {}


vercel = VercelAIGatewayProfile(
    name="ai-gateway", aliases=("vercel", "vercel-ai-gateway", "ai_gateway", "aigateway"),
    env_vars=("AI_GATEWAY_API_KEY",), base_url="https://ai-gateway.vercel.sh/v1",
    default_headers={"HTTP-Referer": "https://kestrel-agent.nousresearch.com", "X-Title": "Kestrel Agent"},
    default_aux_model="google/gemini-3-flash",
)

register_provider(vercel)
