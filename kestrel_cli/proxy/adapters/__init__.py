# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Upstream adapter registry for the local proxy server (see :class:`UpstreamAdapter`)."""

from typing import Dict, Type

from kestrel_cli.proxy.adapters.base import UpstreamAdapter
from kestrel_cli.proxy.adapters.nous_portal import NousPortalAdapter
from kestrel_cli.proxy.adapters.xai import XAIGrokAdapter

# Keyed by the ``kestrel proxy start --provider <name>`` value.
ADAPTERS: dict[str, type[UpstreamAdapter]] = {"nous": NousPortalAdapter, "xai": XAIGrokAdapter}


def get_adapter(name: str) -> UpstreamAdapter:
    """Instantiate an adapter by provider name."""
    key = (name or "").strip().lower()
    if key not in ADAPTERS:
        available = ", ".join(sorted(ADAPTERS)) or "(none)"
        raise ValueError(f"Unknown proxy upstream provider: {name!r}. Available: {available}")
    return ADAPTERS[key]()


__all__ = ["ADAPTERS", "UpstreamAdapter", "get_adapter"]
