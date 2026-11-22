# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Launch-env policy for external-process (ACP) providers comes from their profiles' ``process_*`` fields."""

import pytest

import providers
from providers.base import ProviderProfile


@pytest.fixture
def vendor_profiles(monkeypatch):
    profiles = [
        ProviderProfile(name="vendor-acp", auth_type="external_process", process_command="vendor",
                        process_command_env_vars=("VENDOR_ACP_COMMAND", "VENDOR_CLI_PATH"),
                        process_args_env_var="VENDOR_ACP_ARGS"),
        ProviderProfile(name="vendor-api", auth_type="api_key", env_vars=("VENDOR_API_KEY",)),
    ]
    monkeypatch.setattr(providers, "list_providers", lambda: list(profiles))
    return profiles


def test_launch_env_names_cover_every_external_process_override(vendor_profiles):
    from kestrel_cli.auth_external_process import external_process_launch_env_names

    assert external_process_launch_env_names() == {"VENDOR_ACP_COMMAND", "VENDOR_CLI_PATH", "VENDOR_ACP_ARGS"}


@pytest.mark.parametrize("name", ["VENDOR_ACP_COMMAND", "VENDOR_CLI_PATH", "VENDOR_ACP_ARGS"])
def test_env_writer_refuses_a_provider_executable_override(vendor_profiles, name):
    from kestrel_cli.config import validate_env_var_name_for_write

    with pytest.raises(ValueError, match="writer denylist"):
        validate_env_var_name_for_write(name)
    validate_env_var_name_for_write("VENDOR_API_KEY")  # an ordinary provider secret stays writable
