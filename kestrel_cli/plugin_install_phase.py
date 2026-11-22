# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""The slow steps of a plugin install, as ids. A leaf module (stdlib only) so the gateway wire contract
(``tui_gateway/contracts/connectors_operation.py``) can type them without importing the installer."""

from enum import StrEnum


class InstallPhase(StrEnum):
    """The slow steps of an install, as ids; the desktop catalog card words them in its own language."""

    downloading = "downloading"
    python_packages = "python_packages"
    loading_tools = "loading_tools"
