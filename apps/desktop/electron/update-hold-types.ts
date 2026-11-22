// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// What the blocked boot screen shows while an update hold keeps the local
// backend stopped (R8 D3). Shared by the main process (update-hold-wiring.ts)
// and the renderer (src/global.d.ts), so the wire shape has one definition.
export interface UpdateHoldWire {
  holdId: string
  /** `held`: a leftover process holds the checkout lock; `busy`/`error`: ownership could not be verified. */
  verdict: 'held' | 'busy' | 'error'
  /** The update process that wrote the marker (exited), when known. */
  ownerPid: number | null
  /** Epoch ms the hold was first seen. */
  since: number
  /** Epoch ms of the latest check. */
  checkedAt: number
  logPath: string
}
