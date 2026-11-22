# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""StepFun provider profile."""

from providers import register_provider
from providers.base import ProviderProfile

stepfun = ProviderProfile(
    name="stepfun", aliases=("step", "stepfun-coding-plan"), default_aux_model="step-3.5-flash",
    env_vars=("STEPFUN_API_KEY",), base_url="https://api.stepfun.ai/step_plan/v1",
)

register_provider(stepfun)
