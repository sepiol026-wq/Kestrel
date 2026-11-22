// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/** Coalesce a stream of values (pointermove positions, resize deltas) to one
 *  `apply` per animation frame, so a drag can't drive several layouts per frame.
 *  `push` records the latest value and schedules a frame; `finish` commits the
 *  last value and cancels any pending frame (call it on pointerup/cancel).
 *  `null` is the empty sentinel, so `T` must never legitimately be `null`. */
export function rafCoalesce<T>(apply: (value: T) => void): { finish: () => void; push: (value: T) => void } {
  let frame: null | number = null
  let pending: null | T = null

  const flush = () => {
    frame = null

    if (pending !== null) {
      apply(pending)
    }
  }

  return {
    finish() {
      if (frame !== null) {
        cancelAnimationFrame(frame)
        frame = null
      }

      if (pending !== null) {
        apply(pending)
      }
    },
    push(value) {
      pending = value
      frame ??= requestAnimationFrame(flush)
    }
  }
}
