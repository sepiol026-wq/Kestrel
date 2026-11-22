# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Tests for tools.environments.docker.find_docker — Docker CLI discovery."""

from unittest.mock import patch

import pytest

from tools.environments import docker as docker_mod


@pytest.fixture(autouse=True)
def _reset_cache():
    """Clear the module-level docker executable cache between tests."""
    docker_mod._docker_executable = None
    yield
    docker_mod._docker_executable = None


class TestFindDocker:

    def test_not_in_path_falls_back_to_known_locations(self, tmp_path):
        # Create a fake docker binary at a known path
        fake_docker = tmp_path / "docker"
        fake_docker.write_text("#!/bin/sh\n")
        fake_docker.chmod(0o755)

        with patch("tools.environments.docker.shutil.which", return_value=None), \
             patch("tools.environments.docker._DOCKER_SEARCH_PATHS", [str(fake_docker)]):
            result = docker_mod.find_docker()
        assert result == str(fake_docker)


    def test_docker_preferred_over_podman(self):
        """When both docker and podman are on PATH, docker wins."""
        def which_side_effect(name):
            if name == "docker":
                return "/usr/bin/docker"
            if name == "podman":
                return "/usr/bin/podman"
            return None

        with patch("tools.environments.docker.shutil.which", side_effect=which_side_effect):
            result = docker_mod.find_docker()
        assert result == "/usr/bin/docker"


class TestRuntimeName:
    """The Docker/Podman wording every surface shows must follow the resolved CLI."""

    @pytest.mark.parametrize(
        ("executable", "runtime"),
        [
            ("/usr/bin/docker", "Docker"),
            ("/opt/homebrew/bin/podman", "Podman"),
            ("/usr/bin/podman-remote", "Podman"),
        ],
    )
    def test_runtime_name_follows_resolved_cli(self, executable, runtime):
        assert docker_mod.docker_runtime_name(executable) == runtime
