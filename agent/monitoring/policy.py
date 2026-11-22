# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Install identity for gateway monitoring.

A stable, resettable pseudonymous id attached to exported health signals so an
operator can tell instances apart. Carries no account identity; rotate by
clearing ``monitoring.install_id`` in config.
"""

from __future__ import annotations

import logging
import uuid
from typing import Any, Dict

logger = logging.getLogger(__name__)


def ensure_install_id(config: dict[str, Any]) -> str:
    """Return a stable install id, minting and persisting one when empty.

    The id becomes ``service.instance.id`` and must survive restarts, so a fresh
    UUID is written to config.yaml immediately. Fail-open: if persisting fails
    (read-only home, managed scope) the ephemeral id is still returned.
    """
    mon = config.get("monitoring") if isinstance(config, dict) else None
    existing = (mon or {}).get("install_id") if isinstance(mon, dict) else None
    if isinstance(existing, str) and existing.strip():
        return existing
    minted = str(uuid.uuid4())
    try:
        from kestrel_cli.config import load_config, save_config
        fresh = load_config()
        if isinstance(fresh, dict):
            slot = fresh.setdefault("monitoring", {})
            if isinstance(slot, dict) and not str(slot.get("install_id") or "").strip():
                slot["install_id"] = minted
                save_config(fresh)
    except Exception:
        logger.debug("install_id persist failed; using ephemeral id", exc_info=True)
    # Keep the in-memory config consistent for this process either way.
    if isinstance(config, dict):
        config.setdefault("monitoring", {})
        if isinstance(config["monitoring"], dict):
            config["monitoring"]["install_id"] = minted
    return minted


__all__ = ["ensure_install_id"]
