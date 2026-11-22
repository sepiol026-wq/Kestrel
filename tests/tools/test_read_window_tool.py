# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Tests for the GUI-surface ``read_window_below`` tool."""

import json

from tools import read_window_tool as rw




def test_requires_callback():
    """Outside the desktop GUI there is no bridge — a clear error, no crash."""
    result = json.loads(rw.read_window_below_tool(callback=None))
    assert "desktop" in result["error"]


def test_empty_answer_means_unavailable():
    result = json.loads(rw.read_window_below_tool(callback=lambda: ""))
    assert "error" in result


def test_passes_json_through():
    payload = {
        "window": {"app": "Figma", "title": "", "bounds": {"x": 0, "y": 38, "width": 1470, "height": 870}, "id": 13937},
        "frontmost": {"app": "Figma", "title": ""},
        "platform": "darwin",
    }
    result = json.loads(rw.read_window_below_tool(callback=lambda: json.dumps(payload)))
    assert result == payload


def test_wraps_non_json_text():
    result = json.loads(rw.read_window_below_tool(callback=lambda: "plain words"))
    assert result == {"text": "plain words"}


def test_callback_failure_is_reported():
    def _boom():
        raise RuntimeError("renderer went away")

    result = json.loads(rw.read_window_below_tool(callback=_boom))
    assert "renderer went away" in result["error"]
