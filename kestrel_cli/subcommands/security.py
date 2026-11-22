# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""``kestrel security`` subcommand parser."""

from __future__ import annotations

from typing import Callable

from kestrel_cli.subcommands._shared import add_json_flag


def build_security_parser(subparsers, *, cmd_security: Callable) -> None:
    """Attach the ``security`` subcommand to ``subparsers``."""
    security_parser = subparsers.add_parser(
        "security", help="Supply-chain audit (OSV.dev) for venv, plugins, and MCP servers",
        description="On-demand vulnerability scan against OSV.dev. Covers the Kestrel "
            "venv (installed PyPI dists), Python deps declared by plugins under "
            "~/.hermes/plugins/, and pinned npx/uvx MCP servers in config.yaml. "
            "Does NOT scan globally-installed packages or editor/browser extensions.")
    security_subparsers = security_parser.add_subparsers(
        dest="security_command", metavar="<subcommand>")

    audit_parser = security_subparsers.add_parser(
        "audit", help="Run a one-shot supply-chain audit",
        description="Query OSV.dev for known vulnerabilities in installed components.")
    add_json_flag(audit_parser, "Emit machine-readable JSON instead of human-readable text")
    audit_parser.add_argument(
        "--fail-on", default="critical", choices=["low", "moderate", "high", "critical"],
        help="Exit non-zero when any finding meets this severity (default: critical)")
    audit_parser.add_argument(
        "--skip-venv", action="store_true", help="Skip scanning the Kestrel Python venv")
    audit_parser.add_argument(
        "--skip-plugins", action="store_true", help="Skip scanning plugin requirements files")
    audit_parser.add_argument(
        "--skip-mcp", action="store_true", help="Skip scanning pinned MCP servers in config.yaml")
    audit_parser.set_defaults(func=cmd_security)
    security_parser.set_defaults(func=cmd_security)
