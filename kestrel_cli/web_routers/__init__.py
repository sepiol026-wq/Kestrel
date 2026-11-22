# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Extracted APIRouter modules for the dashboard web server.

Each exposes ``router`` (profiles also ``sessions_router``), mounted by ``web_server`` at the
point the routes were originally registered so match order is unchanged. Shared helpers/state
come through the late-binding seam in ``hermes_cli.web_deps``.
"""
