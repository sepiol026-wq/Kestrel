// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { atom } from 'nanostores'

// Mirrors `display.tool_progress`, independent of `display.show_reasoning`:
// hiding thinking must not hide the work. Answer-only is both keys off.
// Parsing matches the gateway's `_load_tool_progress_mode` so the renderer and
// the event stream agree: only false / "off" silence tool rows; every other
// mode (all, new, verbose, unknown, missing) keeps them on.
export const $showToolActivity = atom(true)

export function toolProgressVisible(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value
  }

  return !(typeof value === 'string' && value.trim().toLowerCase() === 'off')
}

export function setShowToolActivityFromConfig(value: unknown): void {
  $showToolActivity.set(toolProgressVisible(value))
}
