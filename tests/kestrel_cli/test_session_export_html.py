# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Tests for the HTML session export renderer."""

from kestrel_cli.session_export_html import (
    generate_html_export,
)








def test_single_session_untitled_coalesces_none_title_and_model():
    """An un-named session (title/model still ``None`` until async title
    generation completes) is the default state, so the single-session export
    must fall back to human-readable defaults for the browser-tab ``<title>``
    and the ``Model:`` meta line — matching the on-page ``<h1>`` — instead of
    leaking the literal string ``None``."""
    session = {"id": "abc", "title": None, "model": None, "messages": []}
    html = generate_html_export(session)

    assert "<title>None</title>" not in html
    assert "<strong>Model:</strong> None" not in html
