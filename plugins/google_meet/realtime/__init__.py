# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Realtime speech: thin OpenAI Realtime client + file-queue speaker for the Meet bot."""

from .openai_client import RealtimeSession, RealtimeSpeaker

__all__ = ["RealtimeSession", "RealtimeSpeaker"]
