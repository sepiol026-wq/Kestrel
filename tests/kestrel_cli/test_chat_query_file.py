# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""--query-file: single-query text arrives verbatim, never shell-interpreted.

Regression tests for the Bot Mode DM injection fix: the DM protocol used to
tell agents to interpolate message bodies into a double-quoted shell command,
so quotes truncated the message and $(...) executed on the sender's machine.
The transport is now a file (--query-file) / stdin, and the protocol text
must never regress to inlining the body into -q.
"""

import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]

def _parse(argv):
    sys.path.insert(0, str(REPO))
    try:
        from kestrel_cli._parser import build_top_level_parser

        built = build_top_level_parser()
        parser = built[0] if isinstance(built, tuple) else built
        return parser.parse_args(argv)
    finally:
        sys.path.remove(str(REPO))

def test_chat_parser_accepts_query_file():
    args = _parse(["chat", "--query-file", "/tmp/x.txt"])
    assert args.query_file == "/tmp/x.txt"
    assert args.query is None

def test_query_and_query_file_mutually_exclusive(tmp_path):
    """argparse rejects -q + --query-file at parse time (exit 2), no env needed."""
    import pytest

    f = tmp_path / "dm.txt"
    f.write_text("hello", encoding="utf-8")
    with pytest.raises(SystemExit) as exc:
        _parse(["chat", "-q", "x", "--query-file", str(f)])
    assert exc.value.code == 2
