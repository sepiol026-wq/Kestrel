# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""The native desktop packages a release builds, defined once.

A target is an (electron platform, arch) pair. Every other spelling derives from
it: the build leg and handoff name ``<platform>-<arch>``, and the manifest row
platform (``macos`` / ``windows``). Intel macOS (darwin-x64) is not built.
"""
from __future__ import annotations

TARGETS = (("darwin", "arm64"), ("win32", "arm64"), ("win32", "x64"))
MANIFEST_PLATFORM = {"darwin": "macos", "win32": "windows"}
# Manifest rows name the platform as macos/windows.
MANIFEST_TARGETS = tuple((MANIFEST_PLATFORM[platform], arch) for platform, arch in TARGETS)
# One staged handoff per target, plus the universal Windows bundle assembled from both arches.
NATIVE_LEGS = (*(f"{platform}-{arch}" for platform, arch in TARGETS), "windows-universal")
