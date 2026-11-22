# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Guardrail for the navigability eval: its symbol resolver must follow the facade/sibling layout.

Two invariants the harness relies on (and that a future refactor could silently break):
  1. a name imported from a facade that lives in a sibling resolves to the SIBLING (through the facade's
     top-level `from sibling import name`);
  2. a name defined in the facade itself resolves to the facade.
Both are checked against real modules on the current tree, so they also pin the layout the eval documents.
"""
from pathlib import Path

import pytest

from evals.codebase_navigability import bench

ROOT = Path(__file__).resolve().parents[2]


@pytest.fixture(scope="module")
def mods():
    return bench.source_modules(ROOT)


def test_tokenizer_falls_back_without_crashing(monkeypatch):
    import builtins
    real_import = builtins.__import__

    def no_tiktoken(name, *a, **k):
        if name == "tiktoken":
            raise ImportError
        return real_import(name, *a, **k)

    monkeypatch.setattr(builtins, "__import__", no_tiktoken)
    tok = bench._tokenizer()
    assert tok("abcdefgh") == 2
