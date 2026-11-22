# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Frozen updater surface: pre-PM updaters import these names from here.

The implementation moved to ``pm.environments``; in-tree code imports it from there.
"""
from pm.environments import (
    activation_environment,
    dependency_home_root,
    install_state_dir,
    runtime_facts_path,
    selected_venv,
    site_packages,
    store_root,
)
