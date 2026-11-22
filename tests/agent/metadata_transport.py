# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Socket-free response data for tests that exercise the real metadata transport."""
import httpx
import pytest


@pytest.fixture
def metadata_transport(monkeypatch):
    from agent import model_metadata

    responses, requests = [], []
    real_client = httpx.Client

    def handle(request):
        requests.append(request)
        return responses.pop(0)

    monkeypatch.setattr(httpx, "Client", lambda **kw: real_client(
        **kw, transport=httpx.MockTransport(handle),
    ))
    monkeypatch.setattr(model_metadata, "detect_local_server_type", lambda *a, **kw: None)
    return responses, requests
