# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""``kestrel console`` subcommand parser."""

from __future__ import annotations

from typing import Callable


def build_console_parser(subparsers, *, cmd_console: Callable) -> None:
    """Attach the safe Kestrel Console REPL subcommand."""
    console_parser = subparsers.add_parser(
        "console", help="Open the safe Kestrel command console",
        description="Open a curated Kestrel command REPL. This is not a raw shell and "
            "does not expose the full Kestrel CLI.")
    console_parser.set_defaults(func=cmd_console)
