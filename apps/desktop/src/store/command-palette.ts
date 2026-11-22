// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { atom } from 'nanostores'

import { releaseTypingFocus } from '@/components/ui/keyboard-first'

/** Whether the global command palette (Cmd/Ctrl+K) is currently open. */
export const $commandPaletteOpen = atom(false)

/** Optional nested page to open when the palette next opens (e.g. `pets`). */
export const $commandPalettePage = atom<string | null>(null)

/** Optional search text to prefill when the palette next opens (type-to-search
 *  from a surface: the keystroke that opened the palette must not be lost). */
export const $commandPaletteSeed = atom<string | null>(null)

export function openCommandPalette(): void {
  $commandPaletteOpen.set(true)
}

/** Open the palette directly on a nested page (`theme`, `pets`, …). */
export function openCommandPalettePage(page: string, seed?: string): void {
  $commandPalettePage.set(page)

  if (seed) {
    $commandPaletteSeed.set(seed)
  }

  $commandPaletteOpen.set(true)
}

// Closing hands the keyboard back to the composer — a hotkey-opened overlay
// owes typing focus to whatever the user was writing, not to its trigger.
// Skipped when the palette action itself moved focus (navigating to a route,
// opening a dialog): those surfaces claim focus after this runs.
function setOpen(open: boolean): void {
  const wasOpen = $commandPaletteOpen.get()

  $commandPaletteOpen.set(open)

  if (!open) {
    $commandPalettePage.set(null)
    $commandPaletteSeed.set(null)

    if (wasOpen) {
      releaseTypingFocus()
    }
  }
}

export function closeCommandPalette(): void {
  setOpen(false)
}

export function setCommandPaletteOpen(open: boolean): void {
  setOpen(open)
}

export function toggleCommandPalette(): void {
  setOpen(!$commandPaletteOpen.get())
}
