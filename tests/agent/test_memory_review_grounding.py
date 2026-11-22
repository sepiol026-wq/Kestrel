# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""The memory-bearing review prompts carry the evidence-grounding rule; the skill prompt does not.

Without it the review fork saved guesses (trait inferences, a one-off "make it shorter" turned
into "user prefers concise responses") as durable memory.
"""

from agent.background_review import _COMBINED_REVIEW_PROMPT, _MEMORY_REVIEW_PROMPT, _SKILL_REVIEW_PROMPT

_RULE_MARKERS = ("GROUNDED in this conversation", "never turn a one-off request into a standing preference")


def test_grounding_rule_is_in_both_memory_prompts_and_not_the_skill_prompt():
    for marker in _RULE_MARKERS:
        assert marker in _MEMORY_REVIEW_PROMPT
        assert marker in _COMBINED_REVIEW_PROMPT
        assert marker not in _SKILL_REVIEW_PROMPT
