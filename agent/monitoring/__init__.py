# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Hermes gateway monitoring: service health + redacted diagnostics over OTLP.

``emitter`` is the in-process event bus: producers hand typed events to a
fire-and-forget queue that never blocks or raises into gateway code, and OTLP
subscribers consume them off the hot path. Nothing is persisted locally.
Out of scope: trajectory capture, usage analytics, any content-bearing signal
(those belong to the NeMo Relay integration).
"""

from __future__ import annotations

from . import emitter, events

emit = emitter.emit
get_emitter = emitter.get_emitter

__all__ = ["emit", "emitter", "events", "get_emitter"]
