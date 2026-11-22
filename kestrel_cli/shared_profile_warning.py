# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Advisory only: simultaneous installs share profile data, not ownership."""
from __future__ import annotations

from pathlib import Path

from kestrel_cli.process_identity import install_id, ledger_entries
from kestrel_constants import hermes_home_key


def shared_profile_warning(*, home: Path | None = None, project_root: Path | None = None) -> str:
    """An old stamp or a profile name alone cannot prove concurrent use."""
    own_install = install_id(project_root)
    home_key = hermes_home_key(home)
    if any(
        entry.get("install") and entry["install"] != own_install
        and entry.get("hermes_home") == home_key
        for entry in ledger_entries(all_installs=True, verified_only=True)
    ):
        return (
            "Another Kestrel installation is using this profile. Both installations share "
            "its settings and data, so changes can conflict. You can continue, or close "
            "the other installation before making changes."
        )
    return ""
