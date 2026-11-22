# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Fixtures for the hand-off suite."""

from __future__ import annotations

import os
import shutil
import tempfile
from pathlib import Path

import pytest


@pytest.fixture
def root(tmp_path: Path):
    """A SHORT cell root. A user's ``~/.hermes`` is a short path; pytest's ``tmp_path`` nests deep enough
    that the gateway's AF_UNIX sockets under ``$HERMES_HOME`` overflow ``sun_path`` (108 bytes) and
    silently degrade, which is a harness artifact, not the user's machine."""
    base = os.environ.get("TMPDIR") or tempfile.gettempdir()
    path = Path(tempfile.mkdtemp(prefix="ho", dir=base))
    (tmp_path / "cell-root").write_text(str(path), encoding="utf-8")
    try:
        yield path
    finally:
        shutil.rmtree(path, ignore_errors=True)
