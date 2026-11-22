#!/usr/bin/env bash
# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

# Stage the pinned bionic CPython (pm package `python`, linux-arm64-bionic
# lock row -- a TUR .deb) into <payload>/python/.
# Thin wrapper around the shared termux_pkg_build.sh; pm owns the pins.
#
# Usage: build_cpython.sh <payload-dir>
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
exec bash "$HERE/termux_pkg_build.sh" python python "$@"
