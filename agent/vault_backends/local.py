# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Local Fernet vault as a login backend (the always-on default)."""

from __future__ import annotations

from typing import Dict, List, Optional

from agent.vault_backends.base import LoginBackend
from agent.vault_store import VaultItemMeta


def _store():
    # Late import: tests and callers patch ``agent.vault_store.get_vault_store``; binding it here
    # at call time keeps that facade name the single seam.
    from agent.vault_store import get_vault_store
    return get_vault_store()


class LocalLoginBackend(LoginBackend):
    name = "local"
    display_name = "Hermes vault"
    prefix = "vault_"

    def list_items(self) -> list[VaultItemMeta]:
        return _store().list_items()

    def get_meta(self, handle: str) -> Optional[VaultItemMeta]:
        return _store().get_meta(handle)

    def resolve_password(self, handle: str) -> str:
        return str(_store().resolve_secret(handle).get("password") or "")

    def resolve_otp(self, handle: str) -> Optional[str]:
        from agent.vault_store import totp_now
        seed = str(_store().resolve_secret(handle).get("otp_secret") or "")
        return totp_now(seed) if seed else None

    def resolve_secret(self, handle: str) -> dict[str, str]:
        return {k: str(v) for k, v in _store().resolve_secret(handle).items()}
