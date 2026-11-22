# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""MCP URL errors reach the model and ``hermes mcp test``: a credential in the URL must not ride along (#133713)."""
import pytest

from tools.mcp_tool_errors import InvalidMcpUrlError, _validate_remote_mcp_url


@pytest.mark.parametrize("param", ["token", "sig", "code"])
def test_invalid_url_error_masks_query_credentials(param):
    secret = "s3cr3t" + "Value" + "0123456789"
    with pytest.raises(InvalidMcpUrlError) as exc:
        _validate_remote_mcp_url("srv", f"ftp://mcp.example.com/mcp?{param}={secret}")
    assert secret not in str(exc.value)
    assert "mcp.example.com" in str(exc.value)


def test_invalid_url_error_masks_userinfo():
    secret = "hun" + "ter2pass"
    with pytest.raises(InvalidMcpUrlError) as exc:
        _validate_remote_mcp_url("srv", f"ftp://user:{secret}@mcp.example.com/mcp")
    assert secret not in str(exc.value)
