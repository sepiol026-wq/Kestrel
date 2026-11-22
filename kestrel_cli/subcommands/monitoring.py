# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""``kestrel monitoring`` subcommand parser (gateway health/diagnostics export control)."""

from __future__ import annotations

from typing import Callable


def build_monitoring_parser(subparsers, *, cmd_monitoring: Callable) -> None:
    """Attach the ``monitoring`` subcommand (with actions) to ``subparsers``."""
    p = subparsers.add_parser(
        "monitoring", help="Inspect gateway monitoring (health & diagnostics export)",
        description="Gateway monitoring: service health metrics plus redacted "
            "diagnostics, exported over OTLP to an operator-configured "
            "endpoint. Content-free by construction — no prompts, messages, "
            "tool args/results, or usage analytics. Configure under "
            "monitoring.* in config.yaml.")
    sub = p.add_subparsers(dest="monitoring_action")

    sub.add_parser("status", help="Show monitoring settings, export state, and redaction posture")

    p.set_defaults(func=cmd_monitoring)
