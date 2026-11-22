# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""The issue record config validation emits (``kestrel config check``, doctor, startup warnings).

Its own module so the facade (``hermes_cli.config``) and its check siblings share it without
a facade import from the siblings."""

from dataclasses import dataclass


@dataclass
class ConfigIssue:
    """A detected config structure problem."""
    severity: str  # "error", "warning"
    message: str
    hint: str


def _issue(issues: list[ConfigIssue], severity: str, message: str, hint: str) -> None:
    issues.append(ConfigIssue(severity, message, hint))
