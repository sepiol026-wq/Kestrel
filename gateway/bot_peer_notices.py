# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""What the runtime itself may send to the author of an inbound message (#137027).

A bot peer reads every message in its chat as a new inbound turn, so a runtime-written notice (busy
ack, redirect, status, progress, warnings, failure copy, delegation failures) sent to it starts a
turn there, whose reply starts one here. The model's own reply is the only thing a bot peer gets.
Every automatic-notice egress asks ``automatic_notices_allowed``; none re-derives the rule.
"""

from __future__ import annotations

from typing import Any


def automatic_notices_allowed(source: Any) -> bool:
    """False when the message came from a known bot (``SessionSource.is_bot``, a bool: the platform's
    bot flag or the adapter's ``bot_users`` opt-in). Anything but a real ``True`` is not a known bot."""
    return getattr(source, "is_bot", False) is not True
