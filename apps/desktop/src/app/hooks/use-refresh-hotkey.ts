// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useEffect, useRef } from 'react'

/**
 * Binds the bare `r` key to a refresh action while the calling view is mounted.
 * Ignored when a modifier is held, the event repeats, or focus is in an
 * editable field (so typing "r" in a search/input never triggers it).
 */
export function useRefreshHotkey(onRefresh: () => void, enabled = true) {
  const ref = useRef(onRefresh)
  ref.current = onRefresh

  useEffect(() => {
    if (!enabled) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'r' && event.key !== 'R') {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || event.repeat) {
        return
      }

      const target = event.target as HTMLElement | null

      if (
        target?.isContentEditable ||
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        return
      }

      event.preventDefault()
      ref.current()
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled])
}
