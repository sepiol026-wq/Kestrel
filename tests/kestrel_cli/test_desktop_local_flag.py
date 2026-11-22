# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""The desktop subcommand's --local launch flag.

Local models ship on main behind this flag: `hermes desktop --local` (or
`Hermes.exe --local` directly) shows the local-models GUI surfaces; without
it the desktop hides them all, even when local models are configured. These
tests pin the argparse contract; the pass-through to the Electron argv lives
in cmd_gui's launch paths.
"""

import argparse

from kestrel_cli.subcommands.gui import build_gui_parser

def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="hermes")
    subparsers = parser.add_subparsers(dest="command")
    build_gui_parser(subparsers, cmd_gui=lambda args: None)

    return parser

def test_local_flag_parses():
    args = _parser().parse_args(["desktop", "--local"])

    assert args.local is True

def test_local_flag_defaults_off():
    args = _parser().parse_args(["desktop"])

    assert args.local is False
