# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""The package lock must never choose an unstable Node release."""
from pm import update


def test_node_candidates_exclude_prereleases(monkeypatch):
    from pm.registry import get_package

    monkeypatch.setattr(update, "_get_json", lambda url: [
        {"version": "v26.8.0-alpha.0"}, {"version": "v26.7.0"},
        {"version": "v24.0.0-rc.1"}, {"version": "v24.20.0"},
    ])
    versions = get_package("node").latest_versions("linux-x64")
    assert versions == ["26.7.0", "24.20.0"]
    assert get_package("termux-docker").latest_versions("linux-arm64-bionic") == []
