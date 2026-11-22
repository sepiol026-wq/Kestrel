// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/** A promise plus the handle that settles it.
 *
 *  For tests that need a call to stay in flight — asserting the pending UI,
 *  proving a second call is coalesced or ignored, ordering two resolutions —
 *  and then release it on their own schedule. */
export function deferred<T = void>() {
  let resolve!: (value: PromiseLike<T> | T) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((done, fail) => {
    resolve = done
    reject = fail
  })

  return { promise, reject, resolve }
}
