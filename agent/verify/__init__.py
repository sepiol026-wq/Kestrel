# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Project verification subsystem.

Scoped port of superagent-ai/grok-cli's verify subsystem (``src/verify/recipes.ts``,
``src/verify/environment.ts``): static run-recipe detection, a persisted
environment manifest, and a smoke-test runner used by ``hermes verify``.
"""

from agent.verify.environment import load_manifest, load_or_detect, manifest_path, save_manifest
from agent.verify.recipes import Recipe, detect_package_manager, detect_recipe
from agent.verify.runner import PhaseResult, ReadinessResult, VerifyResult, run_verify

__all__ = [
    "PhaseResult",
    "ReadinessResult",
    "Recipe",
    "VerifyResult",
    "detect_package_manager",
    "detect_recipe",
    "load_manifest",
    "load_or_detect",
    "manifest_path",
    "run_verify",
    "save_manifest",
]
