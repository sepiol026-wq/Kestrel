# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Invariant for registry-owned slash execution (CommandDef.execute).

Every ``CommandDef`` with ``execute`` set must name a key that exists in
:data:`hermes_cli.slash_exec.EXECUTORS`; otherwise the command silently falls
through to "unknown command" on every surface.
"""

from kestrel_cli.commands import COMMAND_REGISTRY
from kestrel_cli.slash_exec import resolve_executor


def test_every_execute_key_resolves_to_an_executor():
    migrated = [cmd for cmd in COMMAND_REGISTRY if cmd.execute]
    assert migrated
    unresolved = [cmd.name for cmd in migrated if resolve_executor(cmd) is None]
    assert not unresolved, f"CommandDef.execute names no EXECUTORS entry: {unresolved}"
