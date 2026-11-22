# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Shared migration guards for Hermes' native NeMo Relay ownership."""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any


RELAY_PLUGINS_CONFIG_ENV = "HERMES_NEMO_RELAY_PLUGINS_TOML"

LEGACY_RELAY_PLUGIN_KEYS = frozenset({"nemo_relay", "observability/nemo_relay"})

LEGACY_RELAY_EXPORT_ENV_VARS = frozenset({
    "HERMES_NEMO_RELAY_ATOF_ENABLED",
    "HERMES_NEMO_RELAY_ATOF_OUTPUT_DIRECTORY",
    "HERMES_NEMO_RELAY_ATOF_FILENAME",
    "HERMES_NEMO_RELAY_ATOF_MODE",
    "HERMES_NEMO_RELAY_ATIF_ENABLED",
    "HERMES_NEMO_RELAY_ATIF_OUTPUT_DIRECTORY",
    "HERMES_NEMO_RELAY_ATIF_FILENAME_TEMPLATE",
    "HERMES_NEMO_RELAY_ATIF_AGENT_NAME",
    "HERMES_NEMO_RELAY_ATIF_AGENT_VERSION",
    "HERMES_NEMO_RELAY_ATIF_EXPORT_TIMEOUT_S",
    "HERMES_NEMO_RELAY_ATIF_MODEL_NAME",
    "HERMES_NEMO_RELAY_ATIF_SUBAGENT_EXPORT_MODE",
})


def legacy_relay_plugin_keys(values: Any) -> tuple[str, ...]:
    """Return removed Relay plugin identities present in a config value."""
    if not isinstance(values, (list, tuple, set, frozenset)):
        return ()
    return tuple(sorted({v for v in values if isinstance(v, str) and v in LEGACY_RELAY_PLUGIN_KEYS}))


def configured_legacy_relay_env_vars(env: Mapping[str, Any] | None) -> tuple[str, ...]:
    """Return non-empty legacy Relay exporter variables in *env*."""
    if env is None:
        return ()
    return tuple(sorted(
        name for name in LEGACY_RELAY_EXPORT_ENV_VARS if env.get(name) is not None and str(env[name]).strip()
    ))
