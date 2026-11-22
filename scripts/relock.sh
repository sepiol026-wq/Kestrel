#!/usr/bin/env bash
# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

# Refresh uv.lock from pyproject.toml, then re-sync this checkout's environment.
#
# `scripts/run-in-hermes-env python -m pm.cli lock` cannot do this: a changed
# pyproject.toml makes the environment stale, so the wrapper syncs first, and
# the sync refuses the stale uv.lock before `pm lock` runs. The bootstrap
# Python runs pm without any dependency installed, so the lock comes first.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo="$(dirname "$here")"
# shellcheck source=scripts/_activation.sh
. "$here/_activation.sh"
python="$(hermes_bootstrap_python "$repo")" || {
    echo "no bootstrap Python found; run setup-hermes.sh" >&2
    exit 1
}
(cd "$repo" && PYTHONHOME= PYTHONPATH="$repo" "$python" -m pm.cli lock)
exec "$here/run-in-hermes-env" true
