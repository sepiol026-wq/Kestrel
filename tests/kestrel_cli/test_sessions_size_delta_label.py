# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Tests for the session-store size-delta label (`hermes sessions optimize*`).

A negative before/after delta means the DB grew — printing
"reclaimed -163.0 MB" for that reads as data loss (issue #70146).
"""

from kestrel_cli.sessions_cmd import _size_delta_label




def test_growth_reports_grew_by_not_negative_reclaimed():
    label = _size_delta_label(-163.0)
    assert "163.0" in label
    assert "reclaimed" not in label
    assert "-" not in label


def test_no_negative_number_ever_rendered():
    """Whatever the sign, the rendered number is never negative."""
    for value in (-9999.9, -0.1, 0.0, 0.1, 9999.9):
        assert "-" not in _size_delta_label(value), value
