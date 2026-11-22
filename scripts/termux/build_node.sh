#!/usr/bin/env bash
# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

# Stage the pinned bionic node (pm package `node`, linux-arm64-bionic lock
# row -- the termux-main nodejs .deb) into <payload>/node/.
# Thin wrapper around the shared termux_pkg_build.sh; pm owns the pins.
#
# Usage: build_node.sh <payload-dir>
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
exec bash "$HERE/termux_pkg_build.sh" node node "$@"
