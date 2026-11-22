// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useEffect, useState } from 'react'

/**
 * Returns true only after `active` has stayed true continuously for `delayMs`.
 * Flips back to false the instant `active` goes false. Use it to gate loading
 * skeletons so a fast operation doesn't flash one — the UI just stays blank for
 * the (sub-perceptible) delay window, and the skeleton appears only when a load
 * is genuinely slow.
 */
export function useDelayedTrue(active: boolean, delayMs = 180): boolean {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (!active) {
      setShown(false)

      return
    }

    const id = window.setTimeout(() => setShown(true), delayMs)

    return () => window.clearTimeout(id)
  }, [active, delayMs])

  return shown
}
