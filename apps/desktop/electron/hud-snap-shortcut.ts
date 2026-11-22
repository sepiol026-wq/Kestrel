// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * HUD snap-to-pointer — global OS shortcut while the HUD is open.
 *
 * Tap ⌘⇧G (CommandOrControl+Shift+G) from any app to park the HUD bar under
 * the cursor. Main owns registration — same authority split as Quick Entry.
 * Electron's globalShortcut is press-only (no keyup), so this is tap-to-snap,
 * not hold-to-follow.
 */

import type { GlobalShortcutLike } from './quick-entry'

export const DEFAULT_HUD_SNAP_SHORTCUT = 'CommandOrControl+Shift+G'

export interface HudSnapShortcutController {
  /** Register the global chord. Returns false when another app owns it. */
  register(): boolean
  /** Release the chord (HUD closed / quit). Idempotent. */
  dispose(): void
}

export function createHudSnapShortcut(
  globalShortcut: GlobalShortcutLike,
  onSnap: () => void
): HudSnapShortcutController {
  let active: null | string = null

  const release = () => {
    if (active) {
      try {
        globalShortcut.unregister(active)
      } catch {
        // Best effort — a dead accelerator must not block re-register.
      }

      active = null
    }
  }

  return {
    register() {
      release()

      const accelerator = DEFAULT_HUD_SNAP_SHORTCUT
      let ok = false

      try {
        ok = globalShortcut.isRegistered(accelerator) ? false : globalShortcut.register(accelerator, onSnap)
      } catch {
        ok = false
      }

      active = ok ? accelerator : null

      return ok
    },
    dispose() {
      release()
    }
  }
}
