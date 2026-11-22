# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""``kestrel backup`` subcommand parser."""

from __future__ import annotations

from argparse import ArgumentTypeError
from typing import Callable


def _non_negative_keep(value: str) -> int:
    # A negative keep would slice away the NEWEST archives instead of the oldest.
    if not value.isdecimal():
        raise ArgumentTypeError("must be a non-negative integer (0 keeps everything)")
    return int(value)


def build_backup_parser(subparsers, *, cmd_backup: Callable) -> None:
    """Attach the ``backup`` subcommand to ``subparsers``."""
    backup_parser = subparsers.add_parser(
        "backup", help="Back up Kestrel home directory to a zip file",
        description="Create a zip archive of your entire Kestrel configuration, "
        "skills, sessions, and data (excludes the kestrel-agent codebase). "
        "Use --quick for a fast snapshot of just critical state files.")
    backup_parser.add_argument(
        "-o",
        "--output", help="Output path for the zip file (default: ~/kestrel-backup-<timestamp>.zip)")
    backup_parser.add_argument(
        "-q", "--quick", action="store_true",
        help="Quick snapshot: only critical state files (config, state.db, .env, auth, cron)")
    backup_parser.add_argument(
        "-l", "--label", help="Label for the snapshot (only used with --quick)")
    backup_parser.add_argument(
        "-k", "--keep", type=_non_negative_keep, default=3, metavar="N",
        help="After a full backup, delete older kestrel-backup-*.zip files in the output "
             "directory beyond the newest N (default 3; 0 keeps everything)")
    backup_parser.set_defaults(func=cmd_backup)
