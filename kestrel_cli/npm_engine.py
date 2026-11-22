# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Stop an already-running old updater before its retired npm retry path."""

from typing import NoReturn

from kestrel_cli._old_updater import stop_historical_updater


def maybe_repair_npm_engine(*args, **kwargs) -> NoReturn:
    # Returning would let old callers retry or continue their stale update.
    stop_historical_updater("hermes_cli.npm_engine.maybe_repair_npm_engine")
