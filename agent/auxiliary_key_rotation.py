# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Rotate the published auxiliary main-runtime key after a credential refresh.

Split from ``agent.auxiliary_client`` (facade size cap).
"""

from __future__ import annotations

from typing import Any


def rotate_runtime_main_api_key(old: Any, new: Any) -> None:
    """Swap a revoked main key for its replacement in the published runtime, IN PLACE.

    A refresh can run inside a request worker's copied Context, where rebinding the ContextVar
    would stay invisible to the turn thread; the published dict is shared, so mutating it is not.
    """
    from agent.auxiliary_client import _RUNTIME_MAIN_CONTEXT, _normalize_api_key

    runtime = _RUNTIME_MAIN_CONTEXT.get()
    if isinstance(runtime, dict) and runtime.get("api_key") == old:
        runtime["api_key"] = _normalize_api_key(new)
