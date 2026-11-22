# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

from __future__ import annotations

from typing import TYPE_CHECKING, Any, Callable

from tools.connectors.portal.client import validate_slug
from tools.connectors.portal.errors import InvalidConnectorSlug
from tools.connectors.portal.wire import PolicyBody, UnrestrictedPolicyBody

if TYPE_CHECKING:
    from tui_gateway.contracts.connectors import ConnectorChange, ToolsChange


class InvalidMemberPolicy(ValueError):
    pass


_LAYERS: dict[str, tuple[bool, Callable[[Any], list[str]]]] = {
    "unrestricted": (False, lambda _body: []),
    "deny-all": (True, lambda _body: []),
    "allow": (True, lambda body: list(body.connectors)),
    "deny": (False, lambda body: list(body.disabled_connectors)),
}


def _layer(member_body: PolicyBody | None) -> tuple[str, list[str], bool]:
    body = member_body or UnrestrictedPolicyBody(mode="unrestricted")
    allow, values_of = _LAYERS[body.mode]
    return "connectors" if allow else "disabledConnectors", values_of(body), allow


def _slug(connector: str) -> str:
    try:
        validate_slug(connector)
    except InvalidConnectorSlug as exc:
        raise InvalidMemberPolicy("connector must be a slug") from exc
    return connector


def _validated_tools(tools: list[str]) -> list[str]:
    if any(not tool or len(tool) > 256 for tool in tools):
        raise InvalidMemberPolicy("disabled_tools must contain non-empty tool slugs up to 256 characters")
    return tools


def compose_connector_write(member_body: PolicyBody | None, change: ConnectorChange) -> dict[str, Any]:
    connector = _slug(change.connector)
    key, values, allow = _layer(member_body)
    retained = [item for item in values if item != connector]
    return {"scope": "member", key: [*retained, connector] if change.enabled == allow else retained}


def compose_tools_write(member_body: PolicyBody | None, change: ToolsChange) -> dict[str, Any]:
    connector = _slug(change.connector)
    key, values, allow = _layer(member_body)
    if (connector in values) != allow:
        raise InvalidMemberPolicy("connector is off in the member policy")
    return {"scope": "member", key: values, "tools": {connector: _validated_tools(change.disabled_tools)}}
