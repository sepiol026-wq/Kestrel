# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""``kestrel slack`` subcommand parser."""

from __future__ import annotations

from typing import Callable


def build_slack_parser(subparsers, *, cmd_slack: Callable) -> None:
    """Attach the ``slack`` subcommand to ``subparsers``."""
    slack_parser = subparsers.add_parser(
        "slack", help="Slack integration helpers (manifest generation, etc.)",
        description="Slack integration helpers for Kestrel.")
    slack_sub = slack_parser.add_subparsers(dest="slack_command")
    slack_manifest = slack_sub.add_parser(
        "manifest",
        help="Print or write a Slack app manifest with every gateway command "
        "registered as a native slash (/btw, /stop, /model, ...)",
        description="Generate a Slack app manifest that registers every gateway "
            "command in COMMAND_REGISTRY as a first-class Slack slash "
            "command (matching Discord and Telegram parity). Paste the "
            "output into Slack app config → Features → App Manifest → "
            "Edit, then Save. Reinstall the app if Slack prompts for it.")
    slack_manifest.add_argument(
        "--write", nargs="?", const=True, default=None, metavar="PATH",
        help="Write manifest to a file instead of stdout. With no PATH "
        "writes to $HERMES_HOME/slack-manifest.json.")
    slack_manifest.add_argument("--name", default=None, help='Bot display name (default: "Kestrel")')
    slack_manifest.add_argument(
        "--description", default=None, help="Bot description shown in Slack's app directory.")
    slack_long_description = slack_manifest.add_mutually_exclusive_group()
    slack_long_description.add_argument(
        "--long-description", default=None, metavar="TEXT",
        help="Set Slack's long app description (175-4,000 characters).")
    slack_long_description.add_argument(
        "--long-description-file", default=None, metavar="PATH",
        help=("Read Slack's long app description from a UTF-8 text file (175-4,000 characters)."))
    slack_manifest.add_argument(
        "--slashes-only", action="store_true",
        help="Emit only the features.slash_commands array (for merging "
        "into an existing manifest manually).")
    slack_messaging = slack_manifest.add_mutually_exclusive_group()
    slack_messaging.add_argument(
        "--no-assistant", action="store_true",
        help="Omit Slack AI Assistant mode (assistant_view, assistant:write "
        "scope, assistant_thread_* events). DMs then render as a flat chat "
        "where bare slash commands (/help, /new) work inline instead of "
        "Slack's Assistant thread pane.")
    slack_messaging.add_argument(
        "--agent-view", action="store_true",
        help="Emit Slack's Agent messaging experience (agent_view, "
        "app_home_opened + message.im) instead of the legacy assistant_view "
        "experience. This changes Slack's app messaging surface and cannot "
        "be reversed in Slack after applying the manifest.")
    slack_parser.set_defaults(func=cmd_slack)
