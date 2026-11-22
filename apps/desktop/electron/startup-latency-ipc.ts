// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { ipcMain } from 'electron'

/** Launch -> first renderer gateway attach, claimable once per main process. Renderer
 *  reloads, extra windows and backend reconnects all re-run the renderer boot, so the
 *  latch must live here (the one object that spans the whole app launch). */
export function createStartupLatencyClaim(uptimeSeconds: () => number = () => process.uptime()): () => null | number {
  let claimed = false

  return () => {
    if (claimed) {
      return null
    }

    claimed = true

    // Main-process uptime starts at Electron launch, before any window or backend exists.
    return Math.max(0, Math.round(uptimeSeconds() * 1000))
  }
}

export function registerStartupLatencyIpc(): void {
  const claim = createStartupLatencyClaim()

  ipcMain.handle('hermes:startup-latency:claim', () => claim())
}
