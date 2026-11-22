# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Tiny offline stdio MCP server installed through the dashboard's MCP catalog (#120527 cell).

Two tools, so the catalog install's tool probe SUCCEEDS with a non-empty list: that is the branch
of ``hermes_cli.mcp_catalog._apply_tool_selection`` that decides between the non-interactive
default and the interactive tool checklist. Nothing here touches the network.
"""

from __future__ import annotations


def main() -> None:
    from mcp.server import MCPServer

    server = MCPServer("dash-catalog-fixture")

    @server.tool()
    def catalog_alpha(text: str = "") -> str:
        """Echo the input (fixture tool one)."""
        return f"alpha:{text}"

    @server.tool()
    def catalog_beta(text: str = "") -> str:
        """Reverse the input (fixture tool two)."""
        return text[::-1]

    server.run(transport="stdio")


if __name__ == "__main__":
    main()
