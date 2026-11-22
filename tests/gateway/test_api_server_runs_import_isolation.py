# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Import-time invariant: a missing ``RequestKey`` must not take ``web`` down with it."""

import importlib
import sys
import types

import aiohttp.web_request
from aiohttp import web


def test_missing_requestkey_keeps_web_module_bound():
    from gateway.platforms import api_server_runs

    stub = types.ModuleType("aiohttp.web_request")
    real = sys.modules["aiohttp.web_request"]
    sys.modules["aiohttp.web_request"] = stub
    try:
        importlib.reload(api_server_runs)
        assert api_server_runs.web is web
        assert api_server_runs.RequestKey is None
    finally:
        sys.modules["aiohttp.web_request"] = real
        importlib.reload(api_server_runs)

    # aiohttp < 3.14 has no RequestKey; the module binds None there, so compare against getattr.
    assert api_server_runs.RequestKey is getattr(aiohttp.web_request, "RequestKey", None)
