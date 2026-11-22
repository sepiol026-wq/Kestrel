// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/** State for the /grid-test reference app. Lives apart from the app
 *  definition so the render components can import the type without a cycle. */

/** Number of live panels in the streams demo (focus wraps mod this). */
export const GRID_STREAM_COUNT = 6

export interface GridTestState {
  activeCol: number
  activeRow: number
  /** Areas mode: fixed-height 2D grid with rowSpan/colSpan demo cells. */
  areas: boolean
  cols: number
  gap: null | number
  nested: boolean
  paddingX: null | number
  rows: number
  /** Streams mode: live-updating panels tiled by GridAreas. */
  streams: boolean
  /** Streams mode: which panel h/l focus is on (0-based, wraps). */
  streamFocus: number
  /** Streams mode: which panel owns the promoted 2x2 slot. */
  streamMain: number
  zoomed: boolean
}
