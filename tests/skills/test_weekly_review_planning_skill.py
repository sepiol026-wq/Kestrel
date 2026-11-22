# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Invariant: every skill a cron blueprint loads ships as a bundled skill."""
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]


def _skill_dir_exists(name: str) -> bool:
    return bool(
        list(REPO_ROOT.glob(f"skills/*/{name}/SKILL.md"))
        + list(REPO_ROOT.glob(f"skills/*/*/{name}/SKILL.md"))
    )


def test_every_blueprint_skill_resolves_in_repo():
    """Invariant: any skill a blueprint loads must exist as a bundled skill."""
    from cron.blueprint_catalog import CATALOG

    for bp in CATALOG:
        for skill_name in bp.skills:
            assert _skill_dir_exists(skill_name), (
                f"blueprint {bp.key!r} loads nonexistent skill {skill_name!r}"
            )
