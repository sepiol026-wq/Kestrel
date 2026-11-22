// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useEffect, useRef } from 'react'

/** Run a UI-only clock while this document is actually being viewed.
 *
 * macOS can leave an occluded BrowserWindow `visible`, and active streaming
 * deliberately disables Chromium's background timer throttling. Pairing focus
 * with visibility avoids waking React for elapsed labels nobody can see while
 * a leading tick on return catches the UI up immediately.
 */
export function useViewedInterval(callback: () => void, intervalMs: number, enabled = true): void {
  const callbackRef = useRef(callback)

  // eslint-disable-next-line no-restricted-syntax -- latest-callback ref avoids restarting the interval each render
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!enabled) {
      return
    }

    let intervalId: null | number = null

    const stop = () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId)
        intervalId = null
      }
    }

    const sync = () => {
      const viewed = document.visibilityState === 'visible' && document.hasFocus()

      if (!viewed) {
        stop()

        return
      }

      if (intervalId === null) {
        callbackRef.current()
        intervalId = window.setInterval(() => callbackRef.current(), intervalMs)
      }
    }

    window.addEventListener('focus', sync)
    window.addEventListener('blur', sync)
    document.addEventListener('visibilitychange', sync)
    sync()

    return () => {
      stop()
      window.removeEventListener('focus', sync)
      window.removeEventListener('blur', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [enabled, intervalMs])
}
