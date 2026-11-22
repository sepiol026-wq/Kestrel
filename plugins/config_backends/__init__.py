# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Config backends (``HERMES_CONFIG_BACKEND``). Selected by ``hermes_cli.config_backend``
directly from the environment, never discovered through the general plugin loader: that loader
reads config.yaml, and the backend is what serves config.yaml (D11). User plugins cannot supply a
config backend."""
