#!/usr/bin/env bash
# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

# Build constants for the termux wheelhouse / .deb pipeline.
#
# These are TARGET facts, not release pins: they change with the build target
# (Android platform tag, build toolchain), not per release. The interpreter
# and node versions live in pm/lock.json (the single pin authority) under
# the python/node packages' linux-arm64-bionic rows; the termux-docker
# container digest is pinned there too (the termux-docker package). This
# file holds only what has no other home.

# PEP 738 platform tag every built wheel is retagged to.
PLATFORM_TAG="android_24_arm64_v8a"

# ABI tag of the bundled interpreter, derived from the pm python version
# (cp314 for the 3.14.x line the lock pins). Kept beside the platform tag
# because index.json's pythonAbi field must agree with it.
PYTHON_ABI="cp314"

# Toolchain pins for the uvloop configured-source build path (--no-build-
# isolation). Pure-python installs only: maturin is deliberately absent --
# it is a native wheel that uv (rightly) refuses to install onto bionic,
# and the rust-backend sdists (pydantic-core, jiter, ...) build through
# ISOLATION, where the sdist's own constraint fetches the backend fresh.
TOOLCHAIN_PINS=(setuptools==84.1.0 cython==3.3.0 pybind11==3.1.0)

# pm package names staged for the payload (linux-arm64-bionic rows).
PAYLOAD_PYTHON_PKG=python
PAYLOAD_NODE_PKG=node
