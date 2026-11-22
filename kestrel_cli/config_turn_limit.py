# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Formatting for resolved foreground turn budgets."""

from kestrel_cli.config import TURN_LIMIT_UNLIMITED


def turn_limit_label(limit: int) -> str:
    """How a resolved turn limit reads on screen."""
    return "unlimited" if limit == TURN_LIMIT_UNLIMITED else str(limit)
