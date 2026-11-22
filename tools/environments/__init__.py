# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Hermes execution environment backends: one BaseEnvironment ABC for running shell commands
in a specific context (local, Docker, SSH, Modal direct/Nous-managed, Daytona, Vercel Sandbox;
plugin backends register through ``agent.terminal_env_registry``). ``terminal_tool._create_environment``
selects the backend from TERMINAL_ENV."""

from tools.environments.base import BaseEnvironment

__all__ = ["BaseEnvironment"]
