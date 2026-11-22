# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

import random

from gateway.status_phrases import (
    choose_status_phrase,
    resolve_status_phrase_catalog,
)




def test_status_phrase_does_not_leak_raw_preview_or_args():
    msg = choose_status_phrase(
        "status",
        preview="actual private scratch text should not be sent",
        args={"secret": "SECRET-123"},
        rng=random.Random(4),
    )

    assert "actual private scratch" not in msg
    assert "SECRET-123" not in msg
    assert msg


def test_status_phrase_path_can_load_relative_directory(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    phrase_dir = tmp_path / "phrase-catalog"
    phrase_dir.mkdir()
    (phrase_dir / "01-status.yaml").write_text("status:\n  - relative dir status text\n", encoding="utf-8")

    catalog = resolve_status_phrase_catalog(
        {"display": {"status_phrases": {"path": "phrase-catalog"}}},
        "whatsapp",
    )

    assert "relative dir status text" in catalog["status"]


def test_choose_status_phrase_uses_custom_catalog_without_leaking_args():
    catalog = resolve_status_phrase_catalog(
        {"display": {"status_phrases": {"mode": "replace", "status": ["custom safe status text"]}}},
        "whatsapp",
    )

    msg = choose_status_phrase(
        "status",
        args={"query": "SECRET SEARCH"},
        catalog=catalog,
    )

    assert msg == "custom safe status text"
    assert "SECRET" not in msg
