# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Unit tests for gateway.cwd_placeholder.resolve_placeholder_terminal_cwd."""

from gateway.cwd_placeholder import resolve_placeholder_terminal_cwd


class TestResolvePlaceholderTerminalCwd:
    def test_local_placeholder_uses_messaging_cwd(self):
        assert resolve_placeholder_terminal_cwd(
            configured_cwd=".",
            terminal_backend="local",
            messaging_cwd="/home/user/project",
            docker_mount_cwd_to_workspace=False,
            home_fallback="/home/user",
        ) == "/home/user/project"


    def test_docker_placeholder_mount_off_unset(self):
        assert resolve_placeholder_terminal_cwd(
            configured_cwd=".",
            terminal_backend="docker",
            messaging_cwd="/home/user",
            docker_mount_cwd_to_workspace=False,
            home_fallback="/home/user",
        ) is None


