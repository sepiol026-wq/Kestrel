# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Pet generation — base-draft → hatch pipeline.

Public surface for the gateway RPCs, ``hermes pets generate``, and tests:
:func:`generate_base_drafts` / :func:`hatch_pet`, :class:`HatchResult`,
:class:`GenerationError`, and :mod:`atlas` (deterministic frame extraction +
atlas composition/validation, testable without any API calls).
"""

from __future__ import annotations

from agent.pet.generate.imagegen import GenerationError
from agent.pet.generate.orchestrate import HatchResult, generate_base_drafts, hatch_pet

__all__ = ["GenerationError", "HatchResult", "generate_base_drafts", "hatch_pet"]
