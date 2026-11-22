# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Shims to suppress old updater work until relaunch. Live identity uses version_info."""


def get_code_identity(refresh: bool = False) -> dict:
    # Shim to suppress old updater work until relaunch, not certify the new checkout.
    return {"sha": None, "short_sha": None, "version": None, "source": "unknown"}
