# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""``kestrel logout`` subcommand parser."""

from __future__ import annotations

from typing import Callable


def build_logout_parser(subparsers, *, cmd_logout: Callable) -> None:
    """Attach the ``logout`` subcommand to ``subparsers``."""
    logout_parser = subparsers.add_parser(
        "logout", help="Clear authentication for an inference provider",
        description="Remove stored credentials and reset provider config")
    logout_parser.add_argument(
        "--provider", choices=["nous", "openai-codex", "xai-oauth"], default=None,
        help="Provider to log out from (default: active provider)")
    logout_parser.set_defaults(func=cmd_logout)
