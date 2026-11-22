# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""``kestrel egress`` subcommand parser."""

from __future__ import annotations


def build_egress_parser(subparsers) -> None:
    """Attach the ``egress`` subcommand to ``subparsers``."""
    # OUTBOUND egress firewall (iron-proxy); `kestrel proxy` is the separate INBOUND
    # OAuth-aggregator reverse proxy.
    egress_parser = subparsers.add_parser(
        "egress", help="Manage the iron-proxy egress credential-injection firewall",
        description="Manage iron-proxy, the optional TLS-intercepting egress firewall "
            "that swaps proxy tokens for real API credentials before outbound "
            "requests leave a sandbox.  Disabled by default.  See: "
            "https://kestrel-agent.nousresearch.com/docs/user-guide/egress/iron-proxy")

    from kestrel_cli import proxy_cli as _proxy_cli
    _proxy_cli.register_cli(egress_parser)

    def _dispatch_egress(args):
        # dest='egress_command' stays disjoint from ``kestrel proxy`` (dest='proxy_command').
        sub = getattr(args, "egress_command", None)
        if sub is not None and hasattr(args, "func") and args.func is not _dispatch_egress:
            return args.func(args)
        egress_parser.print_help()
        return 0

    egress_parser.set_defaults(func=_dispatch_egress)
