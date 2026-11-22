# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Tests for per-provider TLS settings in custom_providers config."""

from kestrel_cli.config import (
    apply_custom_provider_tls_to_client_kwargs,
    get_custom_provider_tls_settings,
)


def test_get_custom_provider_tls_settings_matches_base_url():
    providers = [
        {
            "name": "Ollama",
            "base_url": "https://ollama.example.com/v1",
            "ssl_ca_cert": "/etc/ssl/mkcert-root.pem",
        }
    ]
    tls = get_custom_provider_tls_settings(
        "https://ollama.example.com/v1/",
        custom_providers=providers,
    )
    assert tls == {"ssl_ca_cert": "/etc/ssl/mkcert-root.pem"}


def test_apply_custom_provider_tls_to_client_kwargs():
    client_kwargs = {"api_key": "x", "base_url": "https://ollama.example.com/v1"}
    providers = [
        {
            "name": "Ollama",
            "base_url": "https://ollama.example.com/v1",
            "ssl_ca_cert": "/etc/ssl/mkcert-root.pem",
            "ssl_verify": True,
        }
    ]
    apply_custom_provider_tls_to_client_kwargs(
        client_kwargs,
        "https://ollama.example.com/v1",
        custom_providers=providers,
    )
    assert client_kwargs["ssl_ca_cert"] == "/etc/ssl/mkcert-root.pem"
    assert client_kwargs["ssl_verify"] is True




