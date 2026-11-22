# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""The MCP handshake names kestrel-agent and its release, not the SDK default ("mcp"/"0.1.0")."""

import pytest


def test_session_kwargs_carry_hermes_client_identity():
    from tools.mcp_tool import MCPServerTask, _ensure_mcp_sdk
    if not _ensure_mcp_sdk():
        pytest.skip("mcp SDK not installed")
    from kestrel_cli.version_info import get_version_info

    kwargs = MCPServerTask("identity_test")._session_kwargs()
    assert kwargs["client_info"].name == "kestrel-agent"
    assert kwargs["client_info"].version == get_version_info().base_version
