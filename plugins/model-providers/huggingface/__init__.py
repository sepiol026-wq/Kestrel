# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Hugging Face provider profile."""

from providers import register_provider
from providers.base import ProviderProfile

huggingface = ProviderProfile(
    name="huggingface", aliases=("hf", "hugging-face", "huggingface-hub"), env_vars=("HF_TOKEN",),
    display_name="HuggingFace", description="HuggingFace Inference API",
    signup_url="https://huggingface.co/settings/tokens",
    fallback_models=("Qwen/Qwen3.5-72B-Instruct", "deepseek-ai/DeepSeek-V3.2"),
    base_url="https://router.huggingface.co/v1",
)

register_provider(huggingface)
