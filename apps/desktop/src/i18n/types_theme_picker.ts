// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/** The set_theme picker cards in the chat and their settled receipt. */
export interface ThemePickerCopy {
  accent: string
  layout: string
  mode: string
  customColor: string
  /** A settled accent that is the theme's own colour (no pick stored). */
  themeAccent: string
  basic: string
  basicDetail: string
  elite: string
  eliteDetail: string
  /** The card closed without a pick: dismissed, timed out, or answered in the composer. */
  noPick: string
}
