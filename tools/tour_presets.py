# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""The built-in tour presets ``gui_tour`` start-without-steps accepts.

A leaf module with no ``registry.register``: the wire contract
(``tui_gateway/contracts/server_requests.py``) imports this enum, and importing
``tools/tour_tool.py`` there would register ``gui_tour`` as a side effect.
"""

from enum import StrEnum


class TourPreset(StrEnum):
    """Which built-in tour ``start`` without steps runs."""

    quick = "quick"
    full = "full"
