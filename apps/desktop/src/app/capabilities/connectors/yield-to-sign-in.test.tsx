// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { $freeTierSignIn, $openAppWindows } from '@/store/free-tier-sign-in'

import { useYieldToSignIn } from './connectors-tab'

afterEach(() => $freeTierSignIn.set({ status: 'closed' }))

describe('an open app window and the sign-in', () => {
  it('holds the offer back while open, and closes when a sign-in starts', () => {
    const close = vi.fn()
    const { unmount } = renderHook(() => useYieldToSignIn(true, close))

    expect($openAppWindows.get()).toBe(1)
    expect(close).not.toHaveBeenCalled()

    act(() => $freeTierSignIn.set({ status: 'requested' }))
    expect(close).toHaveBeenCalledWith(null)

    unmount()
    expect($openAppWindows.get()).toBe(0)
  })
})
