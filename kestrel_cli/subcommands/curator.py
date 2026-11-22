# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""``kestrel curator`` subcommand parser."""

from __future__ import annotations

import logging


def build_curator_parser(subparsers) -> None:
    """Attach the ``curator`` subcommand to ``subparsers``."""
    curator_parser = subparsers.add_parser(
        "curator", help="Background skill maintenance (curator) — status, run, pause, pin",
        description="The curator is an auxiliary-model background task that "
            "periodically reviews agent-created skills, prunes stale ones, "
            "consolidates overlaps, and archives obsolete skills. "
            "Bundled and hub-installed skills are never touched. "
            "Archives are recoverable; auto-deletion never happens.")
    try:
        from kestrel_cli.curator import register_cli as _register_curator_cli

        _register_curator_cli(curator_parser)
    except Exception as _exc:
        logging.getLogger("hermes_cli.main").debug("curator CLI wiring failed: %s", _exc)
