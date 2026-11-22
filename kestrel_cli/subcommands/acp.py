# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""``kestrel acp`` subcommand parser."""

from __future__ import annotations

from typing import Callable

from kestrel_cli.subcommands._shared import add_accept_hooks_flag


def build_acp_parser(subparsers, *, cmd_acp: Callable) -> None:
    """Attach the ``acp`` subcommand to ``subparsers``."""
    acp_parser = subparsers.add_parser(
        "acp", help="Run Kestrel Agent as an ACP (Agent Client Protocol) server",
        description="Start Kestrel Agent in ACP mode for editor integration (VS Code, Zed, JetBrains)",
    )
    add_accept_hooks_flag(acp_parser)
    acp_parser.add_argument(
        "--version", action="store_true", dest="acp_version",
        help="Print Kestrel ACP version and exit")
    acp_parser.add_argument(
        "--check", action="store_true",
        help="Verify ACP dependencies and adapter imports, then exit")
    acp_parser.add_argument(
        "--setup", action="store_true",
        help="Run interactive Kestrel provider/model setup for ACP terminal auth")
    acp_parser.add_argument(
        "--setup-browser", action="store_true",
        help="Install PM's pinned Chromium for browser_exec (idempotent).")
    acp_parser.add_argument(
        "--yes", "-y", action="store_true", dest="assume_yes",
        help="Accept all prompts (used by --setup-browser to skip the "
             "~400 MB Chromium download confirmation).")
    acp_parser.set_defaults(func=cmd_acp)
