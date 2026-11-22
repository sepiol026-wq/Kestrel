# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

from pathlib import Path

import pytest

from agent import account_usage, billing_usage
from kestrel_constants import (
    get_kestrel_home,
    reset_kestrel_home_override,
    set_kestrel_home_override,
)


@pytest.mark.parametrize(
    "fetcher",
    [account_usage._fetch_portal_account, billing_usage.fetch_nous_account],
)
def test_nous_account_fetch_preserves_profile_home_in_timeout_worker(
    monkeypatch, tmp_path: Path, fetcher
):
    """The bounded account fetch must read auth from the routed profile, not the launch profile."""
    launch_home = tmp_path / "launch"
    profile_home = tmp_path / "profiles" / "secondary"
    launch_home.mkdir()
    profile_home.mkdir(parents=True)
    monkeypatch.setenv("HERMES_HOME", str(launch_home))

    observed_homes: list[Path] = []

    def fake_account_fetch(*, force_fresh: bool = False):
        assert force_fresh is True
        observed_homes.append(get_kestrel_home())
        return observed_homes[-1]

    monkeypatch.setattr(
        "hermes_cli.nous_account.get_nous_portal_account_info",
        fake_account_fetch,
    )

    token = set_kestrel_home_override(profile_home)
    try:
        assert get_kestrel_home() == profile_home
        assert fetcher(1.0) == profile_home
    finally:
        reset_kestrel_home_override(token)

    assert observed_homes == [profile_home]
