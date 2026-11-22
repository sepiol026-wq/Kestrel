// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Electron <webview> guests (and iframes) hit-test in their own process, so a
 * pointer-capture drag in the embedder goes silent the moment the cursor
 * crosses one — a sash resize froze after a few pixels of travel into the
 * in-app browser, and only another press could continue it. While a drag is
 * live, make every guest surface transparent to hit-testing (see the
 * `guest-pointer-lock` rule in styles.css) so the window-level pointermove /
 * pointerup listeners keep receiving the gesture.
 */
let depth = 0

/** Suppress pointer events on webview/iframe guests until released. Depth-
 *  counted so overlapping gestures compose; the returned release is
 *  idempotent (drags end through several racing paths — pointerup, blur,
 *  lostpointercapture). */
export function guardGuestPointers(): () => void {
  if (depth === 0) {
    document.body.classList.add('guest-pointer-lock')
  }

  depth += 1
  let released = false

  return () => {
    if (released) {
      return
    }

    released = true
    depth -= 1

    if (depth === 0) {
      document.body.classList.remove('guest-pointer-lock')
    }
  }
}
