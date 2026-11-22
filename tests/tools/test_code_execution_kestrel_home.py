# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""execute_code child env honors the multiplexed per-turn HERMES_HOME override (#110303).

Under a multiplexed Desktop/Dashboard connection one server process serves several
profiles, binding a context-local HERMES_HOME override per turn. ``_build_child_env``
scrubs the server process's ``os.environ`` — which carries the machine-default
HERMES_HOME — so without the rewrite below, skill scripts run via ``execute_code``
silently read/write the wrong profile's directory.
"""

import sys

import pytest

from kestrel_constants import (
    get_kestrel_home_override,
    reset_kestrel_home_override,
    set_kestrel_home_override,
)
from tools.code_execution_env import _build_child_env


@pytest.fixture
def home_override():
    tokens = []

    def _set(path):
        tokens.append(set_kestrel_home_override(path))
        return str(path)

    yield _set
    for token in reversed(tokens):
        reset_kestrel_home_override(token)


def _child_env():
    return _build_child_env(
        rpc_endpoint="sock",
        rpc_token="tok",
        tmpdir="/tmp/hermes-test",
        child_python=sys.executable,
    )


class TestMultiplexedHermesHome:
    def test_override_rewrites_stale_server_default_per_turn(self, monkeypatch, home_override, tmp_path):
        """The reported bug: a child must see the ACTIVE profile's home, not the server default,
        and sequential turns for different profiles each see their own."""
        monkeypatch.setenv("HERMES_HOME", "/machine/default/.hermes")
        alpha = home_override(tmp_path / "profiles" / "alpha")
        assert _child_env()["HERMES_HOME"] == alpha
        beta = home_override(tmp_path / "profiles" / "beta")
        assert _child_env()["HERMES_HOME"] == beta

    def test_no_override_leaves_inherited_value_untouched(self, monkeypatch):
        """Dedicated per-profile processes (no override): zero behavior change."""
        assert get_kestrel_home_override() is None
        monkeypatch.setenv("HERMES_HOME", "/machine/default/.hermes")

        assert _child_env()["HERMES_HOME"] == "/machine/default/.hermes"
