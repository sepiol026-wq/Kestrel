# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""alibaba-coding-plan and alibaba-coding-plan-cn must not both appear in the
/model picker off a single shared key (#101122).

The CN profile now has its own ALIBABA_CODING_PLAN_CN_API_KEY (checked first),
keeping the shared ALIBABA_CODING_PLAN_API_KEY / DASHSCOPE_API_KEY as ordered
fallbacks so existing CN users are not broken.  The picker hides a ``-cn`` row
whose only lit vars are shared with a lit non-CN sibling row.
"""

import os
from unittest.mock import patch

from kestrel_cli.model_switch import list_authenticated_providers

_CLEAR = {k: "" for k in ("ALIBABA_CODING_PLAN_API_KEY", "ALIBABA_CODING_PLAN_CN_API_KEY", "DASHSCOPE_API_KEY")}


def _alibaba_slugs(current_provider=""):
    return [p["slug"] for p in list_authenticated_providers(current_provider=current_provider) if "coding-plan" in p["slug"]]


@patch.dict(os.environ, {**_CLEAR, "ALIBABA_CODING_PLAN_CN_API_KEY": "sk-cn-fake"}, clear=False)
def test_alibaba_cn_appears_when_only_cn_key_set():
    assert _alibaba_slugs() == ["alibaba-coding-plan-cn"]


@patch.dict(os.environ, {**_CLEAR, "ALIBABA_CODING_PLAN_API_KEY": "sk-intl-fake"}, clear=False)
def test_alibaba_cn_does_not_appear_when_only_intl_key_set():
    """#101122: the shared intl key alone must light only the intl row."""
    assert _alibaba_slugs() == ["alibaba-coding-plan"]
