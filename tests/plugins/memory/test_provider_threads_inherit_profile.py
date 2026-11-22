# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Multiplex invariant: every memory provider's background thread runs under the spawner's profile.

Profile isolation is a ContextVar-scoped HERMES_HOME override; a plain ``threading.Thread`` starts
with an EMPTY context, so a provider's prefetch/sync/writer thread would silently resolve the DEFAULT
profile's home (and fail closed on scoped secrets). Each case drives the provider's real spawn path
with a fake backend and asserts the thread saw the parent's home.
"""
from __future__ import annotations

import threading
from unittest.mock import MagicMock

import pytest

from kestrel_constants import get_kestrel_home, reset_kestrel_home_override, set_kestrel_home_override


def _probe_home(seen: dict, key: str = "home"):
    def _record(*_args, **_kwargs):
        seen[key] = get_kestrel_home()
    return _record


def _retaindb(seen, tmp_path):
    from plugins.memory import retaindb

    p = retaindb.RetainDBMemoryProvider()
    p._client = MagicMock()
    p._context_overlay = lambda query: {"context": seen.setdefault("home", get_kestrel_home()) and "ctx"}
    p._client.ask_user.return_value = {"answer": ""}
    p._client.get_agent_model.return_value = {}
    p.queue_prefetch("what do you know")
    return list(p._prefetch_threads)


def _byterover(seen, tmp_path):
    from plugins.memory import byterover

    p = byterover.ByteRoverMemoryProvider()
    p._curate = _probe_home(seen)
    return [p._curate_in_background("content", name="brv-test", what="test")]


_PROVIDERS = {
    "retaindb": _retaindb, "byterover": _byterover,
}


@pytest.mark.parametrize("name", sorted(_PROVIDERS))
def test_provider_background_thread_sees_spawner_profile_home(name, tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "default"))
    profile_home = tmp_path / "profiles" / "b"
    profile_home.mkdir(parents=True)
    seen: dict = {}
    token = set_kestrel_home_override(profile_home)
    try:
        threads = _PROVIDERS[name](seen, tmp_path)
    finally:
        reset_kestrel_home_override(token)
    for t in threads:
        if t is not None:
            t.join(timeout=10)
    assert seen.get("home") == profile_home, f"{name}: background thread resolved {seen.get('home')}"
