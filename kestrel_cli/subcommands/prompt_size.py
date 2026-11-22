# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""``kestrel prompt-size`` subcommand parser."""

from __future__ import annotations

from typing import Callable

from kestrel_cli.subcommands._shared import add_json_flag


def build_prompt_size_parser(subparsers, *, cmd_prompt_size: Callable) -> None:
    """Attach the ``prompt-size`` subcommand to ``subparsers``."""
    prompt_size_parser = subparsers.add_parser(
        "prompt-size", help="Show a byte breakdown of the system prompt + tool schemas",
        description="Report the fixed prompt budget for a fresh session: system "
            "prompt total, skills index, memory, user profile, and tool-schema "
            "JSON. Runs offline (no API call).")
    prompt_size_parser.add_argument(
        "--platform", default="cli",
        help="Platform to simulate (cli, telegram, discord, ...). Default: cli")
    add_json_flag(prompt_size_parser, "Emit the breakdown as JSON")
    prompt_size_parser.set_defaults(func=cmd_prompt_size)
