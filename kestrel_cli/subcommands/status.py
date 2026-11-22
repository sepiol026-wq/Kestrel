# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""``kestrel status`` subcommand parser."""

from __future__ import annotations

from typing import Callable


def build_status_parser(subparsers, *, cmd_status: Callable) -> None:
    """Attach the ``status`` subcommand to ``subparsers``."""
    status_parser = subparsers.add_parser(
        "status", help="Show status of all components",
        description="Display status of Kestrel Agent components")
    status_parser.add_argument(
        "--full", "--all", dest="full", action="store_true",
        help="Show every section (keys redacted) instead of the one-screen summary")
    status_parser.add_argument(
        "--deep", action="store_true", help="Run deep checks (implies --full; may take longer)")
    status_parser.set_defaults(func=cmd_status)
