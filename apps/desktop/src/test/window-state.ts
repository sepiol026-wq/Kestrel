// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Stand-ins for the two window-visibility signals the renderer reacts to:
// Electron's `hermesDesktop.onWindowStateChanged` bridge and the DOM's own
// `document.hidden`. Both are read-only under jsdom, and anything that pauses
// work while the window is hidden — the pet, the terminal pane, budgeted loops,
// pulse animations — needs to drive them.

import { vi } from 'vitest'

export interface WindowStatePayload {
  isMinimized?: boolean
  isVisible?: boolean
}

export interface WindowStateBridge {
  /** Push a state change to whoever subscribed through the bridge. */
  emit: (payload: WindowStatePayload) => void
  /** The unsubscribe handed back to the subscriber, for teardown assertions. */
  off: ReturnType<typeof vi.fn>
}

/** Install a fake `window.hermesDesktop` window-state channel. */
export function installWindowStateBridge(): WindowStateBridge {
  let callback: ((payload: WindowStatePayload) => void) | null = null

  const off = vi.fn(() => {
    callback = null
  })

  Object.defineProperty(window, 'hermesDesktop', {
    configurable: true,
    value: {
      onWindowStateChanged: vi.fn((next: (payload: WindowStatePayload) => void) => {
        callback = next

        return off
      })
    }
  })

  return { emit: payload => callback?.(payload), off }
}

/** Drive `document.hidden` / `document.visibilityState` together. */
export function setDocumentHidden(hidden: boolean) {
  Object.defineProperty(document, 'hidden', { configurable: true, value: hidden })
  Object.defineProperty(document, 'visibilityState', { configurable: true, value: hidden ? 'hidden' : 'visible' })
}
