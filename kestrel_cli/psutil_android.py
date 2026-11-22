# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Shims to stop the old updater doing work until relaunch, not Android support."""

from pathlib import Path
from typing import NoReturn

from kestrel_cli._old_updater import in_historical_update, stop_for_relaunch, stop_historical_updater

# Frozen data for old imports, not a download performed by this module.
PSUTIL_URL = (
    "https://files.pythonhosted.org/packages/aa/c6/"
    "d1ddf4abb55e93cebc4f2ed8b5d6dbad109ecb8d63748dd2b20ab5e57ebe/"
    "psutil-7.2.2.tar.gz"
)


def prepare_patched_psutil_sdist(archive: Path, destination: Path) -> NoReturn:
    # Shim to stop the old updater doing work until relaunch. Extract nothing.
    stop_historical_updater("hermes_cli.psutil_android.prepare_patched_psutil_sdist")


# Shim to stop the old updater doing work until relaunch. Historical callers
# download PSUTIL_URL BEFORE calling prepare_patched_psutil_sdist, so waiting
# for that call is too late. Stop the import without offering a fake URL.
# Only under a historical updater frame: anything else that imports this module
# (an import smoke, a doc tool) would otherwise run a whole update takeover --
# dependency sync, launcher publication and a gateway fleet restart.
if in_historical_update():
    stop_for_relaunch()
