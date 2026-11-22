# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Gauge colouring in curses/ANSI descriptions only touches real ``render_bar`` gauges."""

from kestrel_cli.curses_ui import _gauge_bar_segments
from kestrel_cli.model_picker_usage import render_bar


def test_real_gauges_are_styled():
    for fraction, style in ((0.0, "green"), (0.6, "yellow"), (0.9, "red")):
        bar = render_bar(fraction)
        assert _gauge_bar_segments(f"Today  {bar}  x") == [("Today  ", None), (bar, style), ("  x", None)]


def test_unrelated_brackets_stay_plain():
    for text in ("toggle [] here", "checkbox [ ] off", "a [||] b", "flag [x]", "[" + " " * 11 + "]"):
        assert _gauge_bar_segments(text) == [(text, None)]
