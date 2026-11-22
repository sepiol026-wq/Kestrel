# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Platform adapters for messaging integrations (receive, send, auth, media)."""

from .base import BasePlatformAdapter, SendResult
from .event import MessageEvent

__all__ = ["BasePlatformAdapter", "MessageEvent", "SendResult"]
