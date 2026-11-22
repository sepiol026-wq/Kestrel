# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""is_disk_full_error classifies ENOSPC / SQLITE_FULL failures."""

from __future__ import annotations

import errno
import sqlite3

from kestrel_state_errors import is_disk_full_error


def test_enospc_oserror():
    assert is_disk_full_error(OSError(errno.ENOSPC, "No space left on device")) is True


def test_sqlite_full_operational_error():
    assert is_disk_full_error(sqlite3.OperationalError("database or disk is full")) is True


def test_string_markers():
    assert is_disk_full_error("disk full: session storage could not be written") is True
    assert is_disk_full_error("ENOSPC writing state.db") is True
    assert is_disk_full_error("This is often a full disk — free some space") is True


def test_unrelated_errors():
    assert is_disk_full_error(None) is False
    assert is_disk_full_error(OSError(errno.EACCES, "Permission denied")) is False
    assert is_disk_full_error(RuntimeError("network timeout")) is False
    assert is_disk_full_error("session not found") is False
    assert is_disk_full_error("session storage could not be written: permission denied") is False
