// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

export type TooltipPlacement = 'control' | 'row' | 'toolbar' | 'left-rail' | 'right-rail'

/** Preferred sides express intent; Radix still flips and shifts for available space. */
export const TOOLTIP_PLACEMENTS = {
  control: { side: 'top', align: 'center' },
  row: { side: 'right', align: 'center' },
  toolbar: { side: 'bottom', align: 'center' },
  'left-rail': { side: 'right', align: 'center' },
  'right-rail': { side: 'left', align: 'center' }
} as const
