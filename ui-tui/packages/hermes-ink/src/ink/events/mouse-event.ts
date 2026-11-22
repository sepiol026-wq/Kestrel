// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { Event } from './event.js'

export class MouseEvent extends Event {
  readonly col: number
  readonly row: number
  localCol = 0
  localRow = 0
  readonly cellIsBlank: boolean
  readonly button: number

  constructor(col: number, row: number, cellIsBlank: boolean, button: number) {
    super()
    this.col = col
    this.row = row
    this.cellIsBlank = cellIsBlank
    this.button = button
  }
}
