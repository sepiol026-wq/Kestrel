// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { act, renderHook } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'

import { $collapsedStatusDrawers } from '@/store/composer-status-drawer'
import type * as SessionStates from '@/store/session-states'

import { useStatusDrawer } from './use-status-drawer'

vi.mock('@/store/session-states', async importOriginal => ({
  ...(await importOriginal<typeof SessionStates>()),
  knownOwnerForSession: () => ({ connectionId: 'local', profile: 'default', targetProfile: 'default' })
}))

beforeEach(() => $collapsedStatusDrawers.set([]))

it('keeps stored conversations independent from drafts and other conversations', () => {
  const { result, rerender } = renderHook(({ sessionKey }) => useStatusDrawer(sessionKey), {
    initialProps: { sessionKey: null as string | null }
  })

  act(() => result.current.toggle())
  expect(result.current.collapsed).toBe(true)

  rerender({ sessionKey: 'existing-a' })
  expect(result.current.collapsed).toBe(false)
  act(() => result.current.toggle())
  rerender({ sessionKey: 'existing-b' })
  expect(result.current.collapsed).toBe(false)
  rerender({ sessionKey: 'existing-a' })
  expect(result.current.collapsed).toBe(true)
  rerender({ sessionKey: null })
  expect(result.current.collapsed).toBe(false)
})
