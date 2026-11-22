# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Structured reasoning keeps text and answer channels intact on every chat consumer."""
from evals.providers.reasoning_shapes import run_matrix


def test_stream_reasoning_shapes_preserve_text_and_answer():
    result = run_matrix(("main", "relay", "aux-sync", "aux-async"))
    failures = [row for row in result["results"] if not row["ok"]]
    assert not failures, failures


def test_completed_reasoning_shapes_preserve_text_and_answer():
    result = run_matrix(("nonstream",))
    failures = [row for row in result["results"] if not row["ok"]]
    assert not failures, failures
