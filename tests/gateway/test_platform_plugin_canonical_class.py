# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Plugins whose own code imports siblings by absolute path must register by that same path.

The loader executes a bundled platform package under a synthetic ``hermes_plugins.platforms__<name>``
name. A package whose adapter (or standalone sender / tools) imports ``plugins.platforms.<name>.*``
would then hold two adapter classes: the registry's and the one the rest of the code sees
(``get_active()`` singletons, isinstance checks, monkeypatches).
"""

import importlib

import pytest


@pytest.mark.parametrize("platform, cls", [("signal", "SignalAdapter")])
def test_registry_factory_is_the_canonical_adapter_class(platform, cls):
    from gateway.platform_registry import platform_registry
    from kestrel_cli.plugins import discover_plugins

    discover_plugins()
    entry = platform_registry.get(platform)
    canonical = getattr(importlib.import_module(f"plugins.platforms.{platform}.adapter"), cls)
    assert entry.adapter_factory is canonical, entry.adapter_factory.__module__
