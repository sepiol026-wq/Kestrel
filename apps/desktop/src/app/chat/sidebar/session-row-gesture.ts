// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Which action a left-click on a sidebar session row triggers, given the
// modifier keys held. Kept as a pure resolver (separate from the row
// component) so the precedence — the part that's easy to get subtly wrong —
// is unit-testable without rendering the whole sidebar.

export type SessionRowClickAction = 'archive' | 'newTab' | 'newWindow' | 'pin' | 'resume'

export interface SessionRowClickModifiers {
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
}

/**
 * Resolve the click action from its modifiers.
 *
 * Precedence matters: the multi-modifier gestures (⌥+⇧ archive, ⌘/⌃+⇧ new
 * window) MUST be checked before the single-modifier pin (⇧) and new-tab
 * (⌘/⌃) gestures, because they set those flags too — testing `shiftKey`
 * first would swallow both into "pin".
 *
 * Archive is independent of window support (it works in the web embed too);
 * only the new-window gesture needs standalone windows, and without them
 * ⌘/⌃+⇧ falls through to the plain ⌘/⌃ new-tab behaviour.
 */
export function resolveSessionRowClick(
  { altKey, ctrlKey, metaKey, shiftKey }: SessionRowClickModifiers,
  opts: { canOpenWindow: boolean }
): SessionRowClickAction {
  const primaryModifier = metaKey || ctrlKey

  if (altKey && shiftKey) {
    return 'archive'
  }

  if (primaryModifier && shiftKey && opts.canOpenWindow) {
    return 'newWindow'
  }

  if (primaryModifier) {
    return 'newTab'
  }

  if (shiftKey) {
    return 'pin'
  }

  return 'resume'
}
