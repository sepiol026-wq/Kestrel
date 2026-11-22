// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// @vitest-environment jsdom
import { act, cleanup, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../contrib/wiring', () => ({ WiredPane: () => null }))

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.assign(globalThis, { ResizeObserver: ResizeObserverStub })

import { HudShell } from './hud-shell'

const EDGE_POLL_MS = 300

/** Count callbacks of the edge-measure poll only (the transcript band arms an
 *  unrelated 500ms mount probe), so the assertion is about this timer. */
function countEdgePollFires(): { fires: number } {
  const counter = { fires: 0 }
  const real = window.setInterval.bind(window)

  vi.spyOn(window, 'setInterval').mockImplementation(((cb: TimerHandler, ms?: number, ...rest: unknown[]) => {
    if (typeof cb !== 'function' || ms !== EDGE_POLL_MS) {
      return real(cb, ms, ...rest)
    }

    return real(
      () => {
        counter.fires += 1
        cb()
      },
      ms,
      ...rest
    )
  }) as typeof window.setInterval)

  return counter
}

let visibility: DocumentVisibilityState = 'visible'
let focused = true

describe('HudShell edge poll', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(document, 'visibilityState', 'get').mockImplementation(() => visibility)
    vi.spyOn(document, 'hasFocus').mockImplementation(() => focused)
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // #88275: the window's screen position only moves while someone can see the
  // window, so the 300ms edge poll must park while the document is hidden and
  // run while it is viewed — an ungated interval keeps the idle renderer hot.
  it('parks while the window is hidden and runs while it is viewed', async () => {
    visibility = 'hidden'
    focused = false
    const hidden = countEdgePollFires()

    render(
      <MemoryRouter>
        <HudShell />
      </MemoryRouter>
    )
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3_000)
    })

    expect(hidden.fires).toBe(0)

    cleanup()
    vi.mocked(window.setInterval).mockRestore()

    visibility = 'visible'
    focused = true
    const viewed = countEdgePollFires()

    render(
      <MemoryRouter>
        <HudShell />
      </MemoryRouter>
    )
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3_000)
    })

    expect(viewed.fires).toBeGreaterThan(0)
  })
})
