// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { cellAtIndex, CellWidth, type Screen, setCellStyleId, type StylePool } from './screen.js'

/**
 * Highlight every cell whose OSC 8 hyperlink matches `hoveredUrl` by inverting
 * its style. This is the cursor-hover affordance for clickable links: terminal
 * applications can't change the system mouse cursor, so we light up the link
 * itself when the pointer is over it. Same overlay machinery as
 * applySearchHighlight — post-layout, pure SGR, picked up by the diff.
 *
 * Returns true if any cell was highlighted. The caller decides whether to
 * promote that into a full-frame damage request — for hover specifically,
 * full damage is only useful on enter/leave/change transitions (so the
 * previous frame's inverted cells get re-emitted), not on every steady-state
 * frame the pointer sits on the link.
 */
export function applyHyperlinkHoverHighlight(
  screen: Screen,
  hoveredUrl: string | undefined,
  stylePool: StylePool
): boolean {
  if (!hoveredUrl) {
    return false
  }

  const w = screen.width
  const height = screen.height
  let applied = false

  for (let row = 0; row < height; row++) {
    const rowOff = row * w

    for (let col = 0; col < w; col++) {
      const cell = cellAtIndex(screen, rowOff + col)

      // Skip SpacerTail — the head cell at col-1 owns the hyperlink, and
      // setCellStyleId on the tail would split the styling of a wide-char
      // glyph mid-cell. The head's restyle covers both halves.
      if (cell.width === CellWidth.SpacerTail) {
        continue
      }

      if (cell.hyperlink !== hoveredUrl) {
        continue
      }

      applied = true
      setCellStyleId(screen, col, row, stylePool.withInverse(cell.styleId))
    }
  }

  return applied
}
