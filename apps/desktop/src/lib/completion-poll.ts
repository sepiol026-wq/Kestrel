// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

interface CompletionPollOptions<T> {
  delayMs: number
  poll: () => Promise<T>
  publish: (value: T) => void
}

/**
 * Poll immediately, then wait one full cadence AFTER each request settles.
 *
 * `setInterval` fires on the wall clock, so a request slower than the cadence
 * overlaps the next one and a stalled backend piles up concurrent requests.
 * Rescheduling from settlement keeps the poll single-flight. The returned stop
 * function drops the pending timer and suppresses a late publish.
 */
export function startCompletionPoll<T>({ delayMs, poll, publish }: CompletionPollOptions<T>): () => void {
  let stopped = false
  let timer: number | undefined

  const run = async () => {
    try {
      const value = await poll()

      if (!stopped) {
        publish(value)
      }
    } catch {
      // A transient producer failure keeps the previous value visible.
    }

    if (!stopped) {
      timer = window.setTimeout(() => void run(), delayMs)
    }
  }

  void run()

  return () => {
    stopped = true
    window.clearTimeout(timer)
  }
}
