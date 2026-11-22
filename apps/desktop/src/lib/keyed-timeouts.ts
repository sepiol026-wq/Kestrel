// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/** Per-key setTimeout registry for "let this linger, then drop it" UI state.
 *  Scheduling a key replaces its pending timer, and an entry removes itself
 *  when it fires, so the map never accumulates dead keys. */
export function keyedTimeouts() {
  const timers = new Map<string, ReturnType<typeof setTimeout>>()

  const cancel = (key: string) => {
    const timer = timers.get(key)

    if (timer !== undefined) {
      clearTimeout(timer)
      timers.delete(key)
    }
  }

  return {
    cancel,
    schedule(key: string, delayMs: number, run: () => void) {
      cancel(key)
      timers.set(
        key,
        setTimeout(() => {
          timers.delete(key)
          run()
        }, delayMs)
      )
    }
  }
}
