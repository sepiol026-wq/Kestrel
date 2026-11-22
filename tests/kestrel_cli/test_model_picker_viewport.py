# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Tests for the prompt_toolkit /model picker scroll viewport.

Regression for: when a provider exposes many models (e.g. Ollama Cloud's
36+), the picker rendered every choice into a Window with no max height,
clipping the bottom border and any items past the terminal's last row.
The viewport helper now caps visible items and slides the offset to keep
the cursor on screen.
"""
from cli import HermesCLI


_compute = HermesCLI._compute_model_picker_viewport


class TestPickerViewport:
    def test_short_list_no_scroll(self):
        offset, visible = _compute(selected=0, scroll_offset=0, n=5, term_rows=30)
        assert offset == 0
        assert visible == 5


    def test_offset_recovers_after_stage_switch(self):
        # When the user backs out of the model stage and re-enters with
        # selected=0, a stale offset from the previous stage must collapse.
        offset, visible = _compute(selected=0, scroll_offset=25, n=36, term_rows=30)
        assert offset == 0
        assert 0 in range(offset, offset + visible)

    def test_full_navigation_keeps_cursor_visible(self):
        offset = 0
        for cursor in list(range(36)) + list(range(35, -1, -1)):
            offset, visible = _compute(cursor, offset, n=36, term_rows=30)
            assert cursor in range(offset, offset + visible), (
                f"cursor={cursor} out of view: offset={offset} visible={visible}"
            )
