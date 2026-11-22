# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""``kestrel completion`` subcommand parser."""

from __future__ import annotations

from typing import Callable


def build_completion_parser(subparsers, *, cmd_completion: Callable, parser) -> None:
    """Attach the ``completion`` subcommand to ``subparsers``."""
    completion_parser = subparsers.add_parser(
        "completion", help="Print shell completion script (bash, zsh, or fish)")
    completion_parser.add_argument(
        "shell", nargs="?", default="bash", choices=["bash", "zsh", "fish"],
        help="Shell type (default: bash)")
    completion_parser.set_defaults(func=lambda args: cmd_completion(args, parser))
