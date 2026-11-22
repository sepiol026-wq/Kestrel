# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""submit_stdin presses Enter the way the child's input expects it: CR on a POSIX PTY, LF on a pipe."""

import time
from unittest.mock import MagicMock

import pytest

from tools.process_registry import ProcessRegistry, ProcessSession


@pytest.fixture()
def registry():
    return ProcessRegistry()


def _make_session() -> ProcessSession:
    return ProcessSession(id="proc_submit", command="cat", task_id="t1", started_at=time.time())


@pytest.mark.platforms("posix")
def test_submit_stdin_pty_mode_sends_cr(registry):
    """PTY Enter is \\r — what a real keyboard sends. Raw-mode TUIs bind
    Enter to \\r and ignore \\n; canonical-mode children still see \\n via
    the tty driver's ICRNL mapping.
    """
    pty = MagicMock()
    s = _make_session()
    s._pty = pty
    registry._running[s.id] = s

    result = registry.submit_stdin(s.id, "hello")

    pty.write.assert_called_once_with(b"hello\r")
    assert result["status"] == "ok"


def test_submit_stdin_pipe_mode_sends_newline(registry):
    proc = MagicMock()
    proc.stdin = MagicMock()
    s = _make_session()
    s.process = proc
    registry._running[s.id] = s

    result = registry.submit_stdin(s.id, "hello")

    proc.stdin.write.assert_called_once_with("hello\n")
    assert result["status"] == "ok"
