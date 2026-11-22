# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""``kestrel dump`` subcommand parser."""

from __future__ import annotations

from typing import Callable


def build_dump_parser(subparsers, *, cmd_dump: Callable) -> None:
    """Attach the ``dump`` subcommand to ``subparsers``."""
    dump_parser = subparsers.add_parser(
        "dump", help="Dump setup summary for support/debugging",
        description="Output a compact, plain-text summary of your Kestrel setup "
        "that can be copy-pasted into Discord/GitHub for support context")
    dump_parser.add_argument(
        "--show-keys", action="store_true",
        help="Show redacted API key prefixes (first/last 4 chars) instead of just set/not set")
    dump_parser.set_defaults(func=cmd_dump)
