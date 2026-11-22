// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { type ReactNode, useEffect, useState } from 'react'

/**
 * Mounts `children` only once the browser goes idle (or `timeout` ms elapse),
 * then keeps them mounted for good. Lifts non-critical, boot-hidden surfaces
 * (display:none panes: files/preview/review/logs) off the first-paint critical
 * path with ZERO visible change — idle fires within a frame of first paint, so
 * a hidden pane is warm long before the user can reveal it, preserving the
 * "toggle back is instant" contract while shrinking cold-start app-mount.
 *
 * Degrades to eager mount where requestIdleCallback is absent (jsdom/tests,
 * older webviews), so there's no behavioral fork to reason about there.
 */
export function IdleMount({ children, timeout = 2000 }: { children: ReactNode; timeout?: number }) {
  const [ready, setReady] = useState(typeof requestIdleCallback !== 'function')

  useEffect(() => {
    if (ready) {
      return undefined
    }

    const id = requestIdleCallback(() => setReady(true), { timeout })

    return () => cancelIdleCallback(id)
  }, [ready, timeout])

  return ready ? <>{children}</> : null
}
