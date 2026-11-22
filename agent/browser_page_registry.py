# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Browser page backends registered by plugins via :meth:`PluginContext.register_browser_page_backend`,
consumed by ``tools.browser_vault_tool``. The backend holding the task's live page wins over the CDP
session; with none, the vault uses the CDP supervisor as before."""

from __future__ import annotations

import logging
from typing import Optional

from agent.browser_page_backend import BrowserPageBackend
from agent.provider_registry import ProviderRegistry

logger = logging.getLogger(__name__)

_registry: ProviderRegistry[BrowserPageBackend] = ProviderRegistry(
    label="Browser page backend", provider_cls=BrowserPageBackend, logger=logger,
)
_registry.export(globals())


def backend_for_task(task_id: str) -> Optional[BrowserPageBackend]:
    """The registered backend holding ``task_id``'s live page, or ``None``."""
    for backend in _registry.list_providers():
        try:
            if backend.has_page(task_id):
                return backend
        except Exception as exc:  # health: allow BLE001 -- a probing failure means "no page here"
            logger.debug("browser page backend %s.has_page raised %s", backend.name, exc)
    return None
