// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// The `?win=` kinds whose Electron window is `transparent: true` and so paints
// nothing but its own surface over the user's desktop. `secondary` (a session
// window) and `browser` are ordinary opaque windows and are deliberately not
// in here. index.html's pre-paint script skips exactly this list — keep the
// two in step. No imports: the renderer entry reads it before the app loads.
export const TRANSPARENT_WINDOWS = new Set(['hud', 'overlay', 'quick', 'wake'])

export function isTransparentWindow(search = window.location.search): boolean {
  const win = new URLSearchParams(search).get('win')

  return Boolean(win && TRANSPARENT_WINDOWS.has(win))
}
