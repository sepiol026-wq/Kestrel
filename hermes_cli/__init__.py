# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Compatibility shim forwarding hermes_cli to kestrel_cli."""
from __future__ import annotations

import sys
import kestrel_cli

# Extend package search path so any hermes_cli.<submodule> resolves to kestrel_cli.<submodule>
__path__ = list(kestrel_cli.__path__) + list(__path__)

sys.modules.setdefault("hermes_cli", kestrel_cli)


def __getattr__(name: str):
    return getattr(kestrel_cli, name)
