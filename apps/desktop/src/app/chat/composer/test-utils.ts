// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/** Collapse the selection to the end of the editor's contents.
 *
 *  The composer's undo stack, ref rendering, and trigger detection all read the
 *  live selection, and jsdom starts with none — without this they see a caret
 *  at offset 0 and take the wrong branch. */
export function placeCaretAtEnd(editor: HTMLElement) {
  const range = document.createRange()
  const selection = window.getSelection()!

  range.selectNodeContents(editor)
  range.collapse(false)
  selection.removeAllRanges()
  selection.addRange(range)
}
