// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Dev-only accent override.
 *
 * Live-authoring knob for `retintTheme`: while this holds a hex, the theme
 * context paints the active skin re-seeded from it. `null` means "off" — the
 * theme paints exactly as authored, which is the only state a production build
 * can ever be in (the picker that sets this is installed under
 * `import.meta.env.DEV`).
 *
 * Deliberately NOT persisted. It's a scratch control for finding a color you
 * like, and the outcome is meant to be written into `presets.ts` as a real
 * palette — not carried around as user state that would silently override a
 * theme the user picked later.
 */

import { atom } from 'nanostores'

import { normalizeHex } from './color'

export const $accentOverride = atom<null | string>(null)

export function setAccentOverride(color: null | string): void {
  $accentOverride.set(color === null ? null : (normalizeHex(color) ?? $accentOverride.get()))
}
