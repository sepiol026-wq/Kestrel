# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Helpers for reporting Vercel Sandbox authentication state."""

from __future__ import annotations

import os
from dataclasses import dataclass


_TOKEN_TUPLE_VARS = ("VERCEL_TOKEN", "VERCEL_PROJECT_ID", "VERCEL_TEAM_ID")


@dataclass(frozen=True)
class VercelAuthStatus:
    ok: bool
    label: str
    detail_lines: tuple[str, ...]


def describe_vercel_auth() -> VercelAuthStatus:
    """Return Vercel auth status without exposing secret values."""
    present_token_vars = tuple(name for name in _TOKEN_TUPLE_VARS if os.getenv(name))
    missing_token_vars = tuple(name for name in _TOKEN_TUPLE_VARS if not os.getenv(name))

    if os.getenv("VERCEL_OIDC_TOKEN"):
        details = [
            "mode: OIDC",
            "active env: VERCEL_OIDC_TOKEN",
            "note: OIDC tokens are development-only; use access-token auth for deployments and long-running processes",
        ]
        if present_token_vars:
            details.append(f"also present: {', '.join(present_token_vars)}")
        return VercelAuthStatus(True, "OIDC token via VERCEL_OIDC_TOKEN", tuple(details))

    if not missing_token_vars:
        return VercelAuthStatus(
            True,
            "access token + project/team via VERCEL_TOKEN, VERCEL_PROJECT_ID, VERCEL_TEAM_ID",
            ("mode: access token", "active env: VERCEL_TOKEN, VERCEL_PROJECT_ID, VERCEL_TEAM_ID"),
        )

    if present_token_vars:
        return VercelAuthStatus(
            False,
            f"partial access-token auth (missing {', '.join(missing_token_vars)})",
            (
                "mode: incomplete access token",
                f"present env: {', '.join(present_token_vars)}",
                f"missing env: {', '.join(missing_token_vars)}",
                "recommended: set VERCEL_TOKEN, VERCEL_PROJECT_ID, and VERCEL_TEAM_ID together",
            ),
        )

    return VercelAuthStatus(
        False,
        "not configured",
        ("recommended: set VERCEL_TOKEN, VERCEL_PROJECT_ID, and VERCEL_TEAM_ID",
         "development-only alternative: set VERCEL_OIDC_TOKEN"),
    )
