# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Buzz progress/status thread-routing regressions."""

from gateway.run import _resolve_progress_thread_id


def test_buzz_progress_without_source_thread_uses_triggering_event():
    """Progress for a Buzz reply must inherit the triggering event anchor."""
    assert (
        _resolve_progress_thread_id(
            "buzz",
            source_thread_id=None,
            event_message_id="buzz-event-123",
        )
        == "buzz-event-123"
    )


def test_buzz_progress_preserves_explicit_source_thread():
    assert (
        _resolve_progress_thread_id(
            "buzz",
            source_thread_id="explicit-thread-root",
            event_message_id="buzz-event-123",
        )
        == "explicit-thread-root"
    )
