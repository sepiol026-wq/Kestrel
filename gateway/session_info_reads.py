# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Reports with no messaging handler that the shared gateway serves a local session itself.

Main's classic CLI and its TUI slash worker printed `/toolsets` and `/platforms` from the process
that held the agent. On the shared gateway that process is the owner, so ``slash.exec`` runs the
classic CLI's own line builders (hermes_cli/cli_info_lines.py) here, inside the owning profile, for
this session's toolsets: the same text on the classic CLI, Ink and every other local client.
"""
from __future__ import annotations

import asyncio


def _toolsets(authority, policy):
    from kestrel_cli.cli_info_lines import toolsets_lines
    return toolsets_lines(list(policy.current_toolsets(policy.config(authority, secrets=False))) if policy else [])


def _platforms(authority, policy):
    from kestrel_cli.cli_info_lines import platforms_lines
    return platforms_lines()


READS = {'toolsets': _toolsets, 'platforms': _platforms}


async def owner_lines(authority, lines, offload=None) -> dict:
    """``slash.exec``'s reply for ``lines()``, built off the owner loop in the owning profile, on
    ``offload`` (an awaitable executor hop) or else the loop's default pool."""
    from gateway.session_authorities import owner_scope

    def build():
        with owner_scope(authority):
            return '\n'.join(lines()).strip('\n')
    return {'type': 'exec', 'output': await (offload or asyncio.to_thread)(build)}


async def run_info_read(authority, live, name) -> dict:
    """Render *name* off the owner loop, in the owning profile; None policy = no frozen route."""
    from gateway.session_policy import policy_for_source
    policy = policy_for_source(authority.runner, live.source)
    return await owner_lines(authority, lambda: READS[name](authority, policy))
