# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""``GET /api/health`` ``commit`` contract (review G4).

The public health probe reports the backend's BOOT ``commit`` so an attaching client can refuse a
backend whose boot commit differs from its checkout: a ``serve`` that outlived ``hermes update``
is never re-adopted. The field must always be present
(``null`` off git) and must come from ``get_version_info().commit``.
"""

from __future__ import annotations

import pytest

from kestrel_cli.version_info import VersionInfo


def _info(commit: str | None) -> VersionInfo:
    return VersionInfo(base_version="2026.10.1", derived_version="2026.10.1", distance=0,
                       commit=commit, branch="main", source="git")


@pytest.mark.parametrize("commit", ["0fbe50a9d88aa7e1c0b5f3d2e4a6b8c9d0e1f2a3", None])
def test_health_reports_the_boot_commit_from_version_info(monkeypatch, commit):
    from starlette.testclient import TestClient

    from kestrel_cli.web_routers import status
    import kestrel_cli.web_server as ws

    monkeypatch.setattr(status, "get_version_info", lambda: _info(commit))

    response = TestClient(ws.app).get("/api/health")  # public: no session token

    assert response.status_code == 200
    body = response.json()
    assert body["ok"] is True
    assert "commit" in body, "attaching clients key the boot-identity decision on this field"
    assert body["commit"] == commit
