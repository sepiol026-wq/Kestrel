# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""PM download bytes and install phases remain separate, faithful UI facts."""

from kestrel_cli.web_routers.local_models import _download_progress_hook, _job, _runtime_progress_hook


def test_runtime_stages_preserve_pm_whole_plan_progress():
    job = _job("runtime-install", "engine")
    stage = _runtime_progress_hook(job)
    transfer = _download_progress_hook(job)
    stage("download", 40, 100, "1/2")
    transfer(40, 100, {"engine.zip": [(0, 40)], "dlls.zip": []})
    assert job["phase"] == "downloading-runtime"
    assert "1/2" in job["detail"]
    stage("download", 50, 100, "2/2")
    transfer(50, 100, {"engine.zip": [(0, 40)], "dlls.zip": [(0, 10)]})
    assert job["done_bytes"] == 50 and job["total_bytes"] == 100
    transfer(100, 100, {"engine.zip": [(0, 40)], "dlls.zip": [(0, 60)]})
    stage("unpack", 0, 0, "2/2")
    assert job["phase"] == "unpacking-runtime"
    assert job["done_bytes"] == job["total_bytes"] == 100
    stage("verify", 0, 0, "")
    assert job["phase"] == "verifying-runtime"
    assert sum(end - start for rows in job["ranges"].values() for start, end in rows) == 100
