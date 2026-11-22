#!/usr/bin/env bash
# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

# Stage the pinned bionic uv (pm package `uv`, linux-arm64-bionic lock row
# -- the termux-main uv .deb) into <payload>/uv/. Same pm-consumer shape
# as build_cpython/build_node: pm owns the pin, the download, the hardened
# extraction, and the file-evidence verify. No PATH install -- hermes's
# resolvers compose the payload env at runtime (desktop payload model).
#
# Usage: build_uv.sh <payload-dir>
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
exec bash "$HERE/termux_pkg_build.sh" uv uv "$@"
