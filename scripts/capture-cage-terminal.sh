#!/usr/bin/env bash
# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

set -euo pipefail

out=${1:?usage: $0 OUTPUT.png [command...]}
shift
mkdir -p "$(dirname "$out")"

# This runs inside `cage --`, after Ghostty has already opened the isolated
# Wayland display. Capture before this script exits so Cage keeps the surface
# alive long enough for grim to see it.
if (($#)); then
  "$@"
fi
if ! command -v grim >/dev/null 2>&1; then
  echo "grim is required inside the Cage client session" >&2
  exit 127
fi
grim "$out"
