# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""``transcode_to_ogg_opus`` in-place repair never destroys the source on failure."""

from __future__ import annotations

from types import SimpleNamespace


def test_failed_in_place_repair_keeps_the_source(monkeypatch, tmp_path):
    from gateway.platforms.base import transcode_to_ogg_opus

    monkeypatch.setattr("shutil.which", lambda name: "/usr/bin/ffmpeg")
    monkeypatch.setattr("gateway.platforms.base.subprocess.run",
                        lambda argv, **kw: SimpleNamespace(returncode=1, stderr=b"boom"))
    bad = tmp_path / "bad.ogg"
    bad.write_bytes(b"ID3")
    assert transcode_to_ogg_opus(str(bad), output_path=str(bad)) is None
    assert bad.read_bytes() == b"ID3" and not (tmp_path / "bad.ogg.tmp.ogg").exists()
