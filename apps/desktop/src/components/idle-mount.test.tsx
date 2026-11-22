// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { IdleMount } from './idle-mount'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('IdleMount', () => {
  it('mounts eagerly where requestIdleCallback is unavailable', () => {
    vi.stubGlobal('requestIdleCallback', undefined)

    render(
      <IdleMount>
        <span>child</span>
      </IdleMount>
    )

    expect(screen.getByText('child')).toBeTruthy()
  })

  it('defers the child to idle, then keeps it mounted', () => {
    let fire: (() => void) | null = null

    const ric = vi.fn((cb: () => void) => {
      fire = cb

      return 1
    })

    vi.stubGlobal('requestIdleCallback', ric)
    vi.stubGlobal('cancelIdleCallback', vi.fn())

    render(
      <IdleMount>
        <span>child</span>
      </IdleMount>
    )

    // Not on the first-paint path — nothing rendered until the browser is idle.
    expect(screen.queryByText('child')).toBeNull()
    expect(ric).toHaveBeenCalledOnce()

    act(() => fire?.())

    expect(screen.getByText('child')).toBeTruthy()
  })
})
