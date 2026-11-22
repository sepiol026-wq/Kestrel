# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""``_is_interactive()`` must not trust ``isatty()`` alone on Windows: the CRT reports a DEVNULL /
detached stdin as a TTY, so the background gateway looked interactive and launched browser OAuth."""

import os
import subprocess
import sys

import pytest


@pytest.mark.platforms("windows")
def test_devnull_stdin_is_not_a_console_on_windows():
    code = ("import sys, os; sys.path.insert(0, os.getcwd()); "
            "from tools.mcp_oauth import _stdin_is_console; print(_stdin_is_console(), sys.stdin.isatty())")
    proc = subprocess.run([sys.executable, "-c", code], stdin=subprocess.DEVNULL,
                          capture_output=True, text=True, cwd=os.getcwd(), timeout=60, check=False)
    console, isatty = proc.stdout.split()
    assert isatty == "True", "premise: the Windows CRT calls DEVNULL a tty (else this guard is moot)"
    assert console == "False"
