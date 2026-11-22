# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Regression tests for local terminal initial cwd normalization."""

from pathlib import Path

from tools.environments.local import LocalEnvironment, _resolve_local_initial_cwd
import pytest


def test_relative_initial_cwd_resolves_from_parent(tmp_path, monkeypatch):
    project = tmp_path / "kestrel-agent"
    project.mkdir()
    monkeypatch.chdir(tmp_path)

    assert _resolve_local_initial_cwd("kestrel-agent") == str(project)


@pytest.mark.platforms("linux")
def test_local_environment_keeps_existing_relative_child_cwd(tmp_path, monkeypatch):
    project = tmp_path / "kestrel-agent"
    project.mkdir()
    monkeypatch.chdir(tmp_path)

    env = LocalEnvironment(cwd="kestrel-agent", timeout=5)
    try:
        result = env.execute("pwd", timeout=5)
    finally:
        env.cleanup()

    assert result["returncode"] == 0
    assert result["output"].strip() == str(project)
