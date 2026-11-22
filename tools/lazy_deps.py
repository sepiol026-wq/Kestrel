# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Shims to suppress old updater work until relaunch. New code must not use these."""

from typing import NoReturn

from kestrel_cli._old_updater import stop_historical_updater


def ensure(feature: str, *, prompt: bool = True) -> NoReturn:
    # Shim to suppress old updater work until relaunch. Do not claim readiness.
    # Preserve the dependency-unavailable failure without claiming a completed install.
    raise ImportError("Dependencies are unknown to this old updater. Please relaunch Hermes.")


def install_specs(specs: list[str] | tuple[str, ...], *, timeout: int = 300,
                  constraints: list | None = None, dry_run: bool = False) -> NoReturn:
    # Plugins still call this retired API during normal agent construction.
    # Only an actual updater call stack may transfer control to the updater;
    # argv can still say "serve" or "gateway" when /update runs in-process.
    # Historical updaters also passed constraints/dry_run; accepted and ignored.
    stop_historical_updater("tools.lazy_deps.install_specs", ImportError)
