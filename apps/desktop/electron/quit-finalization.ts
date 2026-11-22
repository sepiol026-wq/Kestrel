// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

const DEFAULT_TIMEOUT_MS = 10_000

type TimerHandle = unknown

type Schedule = (callback: () => void, timeoutMs: number) => TimerHandle

type Cancel = (handle: TimerHandle) => void

export interface QuitFinalizationOptions {
  isWindows: boolean
  hardExit: (code: number) => void
  timeoutMs?: number
  schedule?: Schedule
  cancel?: Cancel
}

export interface QuitFinalization {
  arm: () => void
  cancel: () => void
}

/**
 * Provides a bounded escape hatch for a Windows Electron process that has
 * entered its final quit phase but never emits the completed quit event.
 *
 * The fallback is deliberately armed only from `will-quit`, after the normal
 * before-quit teardown has been admitted. A successful `quit` event cancels it.
 */
export function createQuitFinalization({
  isWindows,
  hardExit,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  schedule = (callback, delay) => setTimeout(callback, delay),
  cancel = handle => clearTimeout(handle as ReturnType<typeof setTimeout>)
}: QuitFinalizationOptions): QuitFinalization {
  let timer: TimerHandle | null = null
  let finished = false

  return {
    arm() {
      if (!isWindows || finished || timer !== null) {
        return
      }

      timer = schedule(() => {
        timer = null

        if (finished) {
          return
        }

        finished = true
        hardExit(0)
      }, timeoutMs)
    },

    cancel() {
      if (finished) {
        return
      }

      finished = true

      if (timer !== null) {
        cancel(timer)
        timer = null
      }
    }
  }
}
