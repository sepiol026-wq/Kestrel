# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""``kestrel checkpoints`` subcommand parser."""

from __future__ import annotations


def build_checkpoints_parser(subparsers) -> None:
    """Attach the ``checkpoints`` subcommand to ``subparsers``."""
    checkpoints_parser = subparsers.add_parser(
        "checkpoints", help="Inspect / prune / clear ~/.kestrel/checkpoints/",
        description="Manage the filesystem checkpoint store — the shadow git "
        "repo hermes uses to snapshot working directories before "
        "write_file/patch/terminal calls. Lets you see how much "
        "space checkpoints occupy, force a prune, or wipe the base.")
    from kestrel_cli.checkpoints import register_cli as _register_checkpoints_cli
    _register_checkpoints_cli(checkpoints_parser)
