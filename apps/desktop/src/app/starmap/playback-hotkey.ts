// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Decide whether a window-level Space keydown should be ignored by the Star
 * Map playback toggle. Ignored when the key is not Space, when something
 * already handled it (`defaultPrevented`), when the user is typing or the
 * focused element handles Space natively (inputs, buttons), or when focus is
 * inside a menu — Radix menu items are `div[role=menuitem]`, so the tag check
 * alone would let Space both activate the item and toggle playback.
 */
export function shouldIgnorePlaybackHotkey(
  e: Pick<KeyboardEvent, 'code' | 'defaultPrevented' | 'key' | 'target'>,
  activeElement: Element | null
): boolean {
  if (e.code !== 'Space' && e.key !== ' ') {
    return true
  }

  if (e.defaultPrevented) {
    return true
  }

  const el = activeElement as HTMLElement | null
  const tag = el?.tagName

  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON' || el?.isContentEditable) {
    return true
  }

  const target = e.target as HTMLElement | null

  if (target?.closest?.('[role=menu]') || el?.closest?.('[role=menu]')) {
    return true
  }

  return false
}
