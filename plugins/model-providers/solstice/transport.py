# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Solstice inference transport: the native Gemini wire on the per-user-quota methods, with the user's
OAuth access token as a Bearer instead of an API key.

Everything else (request building, tool-call ids, thinking config, streaming, error mapping) is the
native adapter's, so a fix there reaches this provider too.
"""

from __future__ import annotations

from typing import Any, Dict

from agent.gemini_native_adapter import GeminiAPIError, GeminiNativeClient, gemini_http_error

from . import INFERENCE_BASE_URL


class SolsticeClient(GeminiNativeClient):
    """``GeminiNativeClient`` on ``:generateContentPerUserQuota`` / ``:streamGenerateContentPerUserQuota``."""

    GENERATE_METHOD, STREAM_METHOD = "generateContentPerUserQuota", "streamGenerateContentPerUserQuota"
    MISSING_KEY_ERROR = "Solstice needs a signed-in account. Run `hermes auth add solstice`."

    def __init__(self, *, base_url: Any = None, **kwargs: Any) -> None:
        # No base means this endpoint, never the generic Gemini default (a different API surface).
        super().__init__(base_url=base_url or INFERENCE_BASE_URL, **kwargs)

    def _auth_headers(self) -> dict[str, str]:
        return {"Authorization": f"Bearer {self.api_key}"}

    def _http_error(self, response: Any, body_text: Any = None) -> GeminiAPIError:
        # The API-key remedies (free tier, Standard key, wrong key surface) do not apply to a bearer.
        return gemini_http_error(response, body_text=body_text, base_url=self.base_url, key_guidance=False)
