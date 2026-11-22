# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""A user's named MoA presets are not schema-defaulted config options."""

from kestrel_cli import config as hermes_config


def test_missing_config_fields_ignores_user_named_presets_but_checks_schema_options(monkeypatch):
    """Custom preset names must not be compared against the built-in ``default`` name."""
    monkeypatch.setattr(
        hermes_config,
        "load_config",
        lambda: {"moa": {"presets": {"keep_a": {}}}, "terminal": {}},
    )

    missing_keys = {field["key"] for field in hermes_config.get_missing_config_fields()}

    assert not any(key.startswith("moa.presets.") for key in missing_keys)
    assert "terminal.backend" in missing_keys
