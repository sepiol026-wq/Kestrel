# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""`hermes status` provider label honors config.yaml model.base_url (#3296)."""

from unittest.mock import patch

from kestrel_cli.status import _effective_provider_label


def _label_with(config, env_base_url=""):
    with patch("hermes_cli.status.resolve_requested_provider", return_value="auto"), \
         patch("hermes_cli.status.resolve_provider", return_value="openrouter"), \
         patch("hermes_cli.status.load_config", return_value=config), \
         patch("hermes_cli.status.get_env_value",
               side_effect=lambda k: env_base_url if k == "OPENAI_BASE_URL" else ""):
        return _effective_provider_label()


def test_config_base_url_labels_custom():
    label = _label_with({"model": {"base_url": "http://localhost:8080/v1"}})
    assert "OpenRouter" not in label


def test_blank_base_url_stays_openrouter():
    label = _label_with({"model": {"base_url": "   "}})
    assert "OpenRouter" in label


def test_non_openrouter_provider_untouched():
    with patch("hermes_cli.status.resolve_requested_provider", return_value="anthropic"), \
         patch("hermes_cli.status.resolve_provider", return_value="anthropic"):
        label = _effective_provider_label()
    assert "OpenRouter" not in label
