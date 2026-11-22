// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/** Cancel a startup wait, and check ownership before invoking its continuation. */
export async function runBackendStartStep<T>(signal: AbortSignal | undefined, run: () => T | Promise<T>): Promise<T> {
  signal?.throwIfAborted()

  if (!signal) {
    return run()
  }

  let onAbort: () => void = () => {}

  const cancelled = new Promise<never>((_resolve, reject) => {
    onAbort = () => reject(signal.reason)
    signal.addEventListener('abort', onAbort, { once: true })
  })

  try {
    const result = await Promise.race([run(), cancelled])
    signal.throwIfAborted()

    return result
  } finally {
    signal.removeEventListener('abort', onAbort)
  }
}
