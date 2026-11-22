# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Tests for the GUI-surface ``focus_pane`` tool."""

import json

import pytest

from tools import desktop_ui, focus_pane_tool as fp


@pytest.fixture(autouse=True)
def _reset_emitter():
    desktop_ui.set_emitter(None)
    yield
    desktop_ui.set_emitter(None)




@pytest.mark.parametrize("pane", fp.PANES)
def test_emits_pane_reveal(pane):
    calls = []
    desktop_ui.set_emitter(lambda sid, event, payload: calls.append((event, payload)))

    out = json.loads(fp.focus_pane_tool(f"  {pane.upper()}  "))

    assert out == {"success": True, "pane": pane}
    assert calls == [("pane.reveal", {"pane": pane})]
