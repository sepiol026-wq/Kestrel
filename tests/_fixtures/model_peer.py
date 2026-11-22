# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Loopback OpenAI-compatible model peer shared by the ordinary-daemon wire tests.

Registered in ``tests/conftest.py`` (see the note there on why fixtures are imported rather than
listed in ``pytest_plugins``) so gateway, ACP and CLI tests receive ``model_peer`` by name.
"""
import pytest


@pytest.fixture
def model_peer():
    from http.server import ThreadingHTTPServer
    import threading
    from tests.gateway.fixtures.shared_authority_peer import ModelPeer
    server = ThreadingHTTPServer(('127.0.0.1', 0), ModelPeer)
    server.requests, server.metadata_requests = [], []
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield server
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=5)
