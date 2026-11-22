// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Where a tip can actually point right now.
 *
 * A tip has no spotlight and no scrim, so a bubble anchored to something the
 * user cannot see is not a dimmed step — it is an arrow into empty space. The
 * anchor is therefore re-resolved from the DOM every time, and a tip whose
 * handles are all missing is simply skipped this round.
 *
 * The `data-pane-hidden` guard is the same one the tour collector owes: an
 * inactive tab in a keep-alive stack stays MOUNTED under `visibility: hidden`
 * so its scroll position survives, which means it keeps its layout box and its
 * rect is identical to the live tab's. No geometry test separates them.
 */

/** The first target that resolves to a visible, on-screen element. */
export function resolveTipAnchor(doc: Document, targets: readonly string[]): HTMLElement | null {
  for (const selector of targets) {
    const element = doc.querySelector<HTMLElement>(selector)

    if (element && isTipAnchorVisible(element)) {
      return element
    }
  }

  return null
}

function isTipAnchorVisible(element: HTMLElement): boolean {
  if (element.closest('[data-pane-hidden]')) {
    return false
  }

  const rect = element.getBoundingClientRect()

  if (rect.width < 8 || rect.height < 8) {
    return false
  }

  const view = element.ownerDocument.defaultView

  if (!view) {
    return true
  }

  return rect.bottom > 0 && rect.top < view.innerHeight && rect.right > 0 && rect.left < view.innerWidth
}
