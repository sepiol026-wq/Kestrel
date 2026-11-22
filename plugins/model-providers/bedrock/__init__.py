# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""AWS Bedrock provider profile."""

from providers import register_provider
from providers.base import ProviderProfile


class BedrockProfile(ProviderProfile):
    """AWS Bedrock — no REST /v1/models endpoint; uses AWS SDK."""


bedrock = BedrockProfile(
    name="bedrock", aliases=("aws", "aws-bedrock", "amazon-bedrock", "amazon"), api_mode="bedrock_converse",
    env_vars=(),  # AWS SDK credentials — not env vars
    base_url="https://bedrock-runtime.us-east-1.amazonaws.com", auth_type="aws_sdk",
    supports_model_listing=False,  # listing goes through the AWS SDK, not a REST call
)

register_provider(bedrock)
