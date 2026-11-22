// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// The theme colours the boot-failure notice (src/lib/boot-failure.ts) paints itself with when
// the app could not load. Written as one snapshot, so a failed write can never pair one theme's
// background with another's ink, and only when each colour stands alone: a `var()` resolves to
// nothing without the app's styles. The notice reads the same key with its own copy of this
// check, so the renderer entry never fetches theme code; boot-palette.test.ts round-trips them.
const KEY = 'hermes-boot-palette'

export interface BootPalette {
  background: string
  foreground: string
  accent: string
  accentForeground: string
}

export function writeBootPalette(palette: BootPalette): void {
  try {
    if (Object.values(palette).every(value => value.trim() !== '' && !/var\(/i.test(value))) {
      localStorage.setItem(KEY, JSON.stringify(palette))
    } else {
      localStorage.removeItem(KEY)
    }
  } catch {
    // A write that failed must not leave an older theme's snapshot behind.
    try {
      localStorage.removeItem(KEY)
    } catch {
      // Storage is unavailable: the notice stays neutral.
    }
  }
}
