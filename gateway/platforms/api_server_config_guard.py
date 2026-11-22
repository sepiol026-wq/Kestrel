# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""aiohttp middleware answering a config-backend outage instead of letting it end the gateway.

``ConfigBackendUnavailable`` is a ``SystemExit`` on purpose (config readers must not serve
defaults instead of the selected backend's config). Escaping an aiohttp handler task, a
``SystemExit`` stops the event loop, so a remote-config plane blip during one request took the
whole gateway down. This middleware turns it into that request's 503.
"""

from __future__ import annotations

from aiohttp import web

from kestrel_cli.config_backend import ConfigBackendUnavailable


@web.middleware
async def config_unavailable_middleware(request: web.Request, handler):
    try:
        return await handler(request)
    except ConfigBackendUnavailable as exc:
        return web.json_response(
            {"error": {"message": str(exc.code), "type": "server_error", "code": "config_backend_unavailable"}},
            status=503)
