# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Regression tests for the esbuild / ignore-scripts build-failure diagnosis (#53082)."""

import io
import contextlib

from kestrel_cli.main_desktop import _diagnose_esbuild_ignore_scripts


def _hintprinted(output: str | None) -> bool:
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        _diagnose_esbuild_ignore_scripts(output)
    return "esbuild" in buf.getvalue()


def test_diagnose_triggers_on_missing_esbuild_binary() -> None:
    output = (
        "Error: The package \"@esbuild/darwin-arm64\" could not be found, "
        "and is needed by esbuild."
    )
    assert _hintprinted(output)


def test_diagnose_triggers_on_ignore_scripts_mention() -> None:
    assert _hintprinted("npm error code ERESOLVE\nnpm warn config ignore-scripts=true")


def test_diagnose_silent_on_unrelated_failure() -> None:
    assert not _hintprinted("vite build failed: unexpected token in index.html")


def test_diagnose_silent_on_none_output() -> None:
    assert not _hintprinted(None)
