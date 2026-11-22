# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Migration 47→48: the container sandbox default becomes nousresearch/hermes-sandbox:desktop.

Contract: a saved image still equal to the OLD default is dropped, so the file follows the new
default at read time but the runtime still sees it as "not pinned" (an existing persisted Docker
sandbox is kept and the user is asked before it is replaced). An image the user pinned
themselves is never touched. Driven through ``run_migrations`` against a temp home.
"""

import os
from unittest.mock import patch

import kestrel_yaml as yaml


def _run(tmp_path, config):
    from kestrel_cli.config_migrations import run_migrations

    (tmp_path / "config.yaml").write_text(yaml.safe_dump(config), encoding="utf-8")
    with patch.dict(os.environ, {"HERMES_HOME": str(tmp_path)}):
        run_migrations(46, {"env_added": [], "config_added": [], "warnings": []}, quiet=True)
    return yaml.safe_load((tmp_path / "config.yaml").read_text(encoding="utf-8"))["terminal"]


def test_stale_default_is_dropped_and_a_user_pin_survives(tmp_path):
    from kestrel_cli.config import load_config
    from kestrel_cli.config_defaults import DEFAULT_SANDBOX_IMAGE, LEGACY_SANDBOX_IMAGE, LEGACY_SANDBOX_IMAGES

    terminal = _run(tmp_path, {"_config_version": 46, "terminal": {
        "backend": "docker",
        "docker_image": LEGACY_SANDBOX_IMAGE,
        "daytona_image": LEGACY_SANDBOX_IMAGES[1],  # the 3.14 pin that shipped between the two, unmigrated
        "singularity_image": f"docker://{LEGACY_SANDBOX_IMAGE}",
        "modal_image": "ghcr.io/me/custom:1",
    }})
    assert "docker_image" not in terminal, "the old default is the template copied, not a pin: drop it"
    assert "singularity_image" not in terminal
    assert "daytona_image" not in terminal, "both plain defaults are template copies"
    assert terminal["modal_image"] == "ghcr.io/me/custom:1", "a user's own image must never be rewritten"
    with patch.dict(os.environ, {"HERMES_HOME": str(tmp_path)}):
        merged = load_config()["terminal"]
    assert merged["docker_image"] == DEFAULT_SANDBOX_IMAGE, "the dropped key follows the new default"
