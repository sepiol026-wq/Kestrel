# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Login backends for the browser credential vault.

The local Fernet store (``agent/vault_store.py``) is one backend; 1Password
(``op``) and Bitwarden Password Manager (``bw``) are the others. Every backend
hands the agent the same shape — opaque handle + login metadata — and resolves
the password server-side at fill time only. Handles are namespaced by backend
(``vault_…`` local, ``op:…``, ``bw:…``) so the browser tools need no schema
change to route to the right one.

External managers are locked until the user unlocks them for the current
session (``agent/vault_backends/unlock.py``); the master password is typed
into a masked prompt owned by the surface (CLI panel, Desktop dialog) and is
never a tool argument, never argv, never persisted.
"""

from agent.vault_backends.base import LoginBackend, UnlockRequired, backend_for_handle, enabled_backends

__all__ = ["LoginBackend", "UnlockRequired", "backend_for_handle", "enabled_backends"]
