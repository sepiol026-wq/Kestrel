# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Paused work remains discoverable, and terminal phase changes honor pause intent."""

from __future__ import annotations

import threading

import pytest

from pm.downloader import DownloadPaused
from tests.hermes_cli.test_local_download_jobs import client


def test_jobs_keep_every_active_download_ahead_of_bounded_history(client):
    from kestrel_cli.web_routers import local_models as lm

    paused = lm._job("runtime-install", "engine")
    paused["status"] = "paused"
    for index in range(25):
        job = lm._job("model-download", f"model-{index}")
        job["status"] = "done"
    active = [lm._job("model-download", f"active-{index}") for index in range(25)]
    response = client.get("/api/local-models/jobs")
    ids = {job["job_id"] for job in response.json()["jobs"]}
    assert {paused["job_id"], *(job["job_id"] for job in active)} <= ids


def test_pause_request_prevents_transition_into_activation(client):
    from kestrel_cli.web_routers import local_models as lm

    job = lm._job("quickstart", "model")
    job["phase"] = "downloading"
    pause = threading.Event()
    lm._RUNNING[job["job_id"]] = {"pause": pause}
    assert client.post("/api/local-models/download/pause", json={"job_id": job["job_id"]}).json()["paused"]
    with pytest.raises(DownloadPaused):
        lm._step(job, "starting-server", "Starting")
    assert job["phase"] == "downloading"
