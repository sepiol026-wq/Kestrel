# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Gateway-side relay authentication primitives. EXPERIMENTAL.

WS upgrade auth (gateway -> connector): ``Authorization: Bearer <token>`` on the
``/relay`` upgrade, ``token = make_upgrade_token(gateway_id, secret)``. Wire bytes
must match the connector's ``relayAuthToken.ts`` ``makeToken`` exactly:
``base64url(f"{payload}:{exp}:{sig}")`` with ``sig = HMAC_SHA256(f"{payload}:{exp}",
secret).hexdigest()``. The connector verifies against a multi-secret rotation list.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import time

_DEFAULT_UPGRADE_TTL_SECONDS = 300  # connector makeUpgradeToken default


def sign(payload: str, secret: str) -> str:
    """HMAC-SHA256 hex digest (UTF-8) — the connector's ``sign``."""
    return hmac.new(secret.encode("utf-8"), payload.encode("utf-8"), hashlib.sha256).hexdigest()


def make_token(payload: str, secret: str, ttl_seconds: int = 0) -> str:
    """``base64url(f"{payload}:{exp}:{sig}")``; ``exp`` unix seconds (0 = never).

    base64url is unpadded to match Node's ``Buffer.toString("base64url")``.
    """
    exp = int(time.time()) + ttl_seconds if ttl_seconds > 0 else 0
    signed = f"{payload}:{exp}"
    raw = f"{signed}:{sign(signed, secret)}".encode()
    return base64.urlsafe_b64encode(raw).decode("ascii").rstrip("=")


def make_upgrade_token(
    gateway_id: str, secret: str, ttl_seconds: int = _DEFAULT_UPGRADE_TTL_SECONDS
) -> str:
    """WS-upgrade bearer: ``payload = gateway_id`` (the connector peeks it to index its verify list)."""
    return make_token(gateway_id, secret, ttl_seconds)
