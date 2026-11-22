// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Shared output location for the visual harness. Hardcoded '/tmp/...' paths
// resolve to a drive-root like C:\tmp on native Windows (and fail when the
// directory doesn't exist) — os.tmpdir() is the platform-neutral answer.
// Both render.tsx and shot.mjs derive the same directory from here;
// HERMES_TUI_VISUAL_DIR overrides it for CI or side-by-side runs.
import { tmpdir } from 'os'
import { join } from 'path'

export function visualOutDir() {
  return process.env.HERMES_TUI_VISUAL_DIR || join(tmpdir(), 'hermes-tui-visual')
}
