# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""The shared wheel fixture models an index: one name/version is one artifact."""
from __future__ import annotations

import time

from tests.pm._fixtures import _wheel


def test_rebuilt_wheel_is_byte_identical_across_a_clock_tick(tmp_path, monkeypatch):
    """A rebuild of the same wheel must hash the same, or a seeded lock fails ``uv sync``."""
    (tmp_path / "a").mkdir()
    (tmp_path / "b").mkdir()
    first = _wheel(tmp_path / "a", "member_dep")
    real_time = time.time
    monkeypatch.setattr(time, "time", lambda: real_time() + 3600)
    second = _wheel(tmp_path / "b", "member_dep")
    assert first.read_bytes() == second.read_bytes()
