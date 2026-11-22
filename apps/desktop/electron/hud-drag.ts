// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * HUD composer-drag geometry — where to park the window so it stays under the
 * OS cursor, including across monitors.
 *
 * Renderer PointerEvent screen coordinates are CSS pixels. Electron's
 * `screen.getCursorScreenPoint()` and `BrowserWindow` bounds are DIP. An
 * absolute grab offset sampled in main stays 1:1 across mixed-DPI displays,
 * even if the last setBounds was clamped to the previous monitor.
 */

export interface HudDragPoint {
  x: number
  y: number
}

export function createHudDragSession() {
  let offset: HudDragPoint | null = null

  return {
    begin(cursor: HudDragPoint, windowOrigin: HudDragPoint) {
      offset = { x: cursor.x - windowOrigin.x, y: cursor.y - windowOrigin.y }
    },
    origin(cursor: HudDragPoint): HudDragPoint | null {
      if (!offset) {
        return null
      }

      return {
        x: Math.round(cursor.x - offset.x),
        y: Math.round(cursor.y - offset.y)
      }
    },
    end() {
      offset = null
    }
  }
}
