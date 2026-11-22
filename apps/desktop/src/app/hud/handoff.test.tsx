// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// @vitest-environment jsdom
import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

const requestComposerFocus = vi.fn()

vi.mock('../chat/composer/focus', () => ({
  getActiveComposer: () => 'main',
  requestComposerFocus: (...args: unknown[]) => requestComposerFocus(...args)
}))

vi.mock('../open-session', () => ({ openSession: vi.fn() }))
vi.mock('@/store/composer', () => ({ reloadPersistedDrafts: vi.fn(), requestComposerDraftSync: vi.fn() }))
vi.mock('@/store/session-states', () => ({ focusOpenSession: () => 'main', sessionTileDelegate: () => null }))

import { useHudHandoff } from './handoff'

type HudChanged = (state: { open: boolean; sessionId: null | string }) => void

const desktopWindow = window as unknown as { hermesDesktop?: Window['hermesDesktop'] }
const initialHermesDesktop = desktopWindow.hermesDesktop
let emitHudChanged: HudChanged | null = null

beforeEach(() => {
  requestComposerFocus.mockClear()
  emitHudChanged = null
  desktopWindow.hermesDesktop = {
    hud: {
      onChanged: (listener: HudChanged) => {
        emitHudChanged = listener

        return () => undefined
      }
    }
  } as unknown as Window['hermesDesktop']
})

afterEach(() => {
  if (initialHermesDesktop) {
    desktopWindow.hermesDesktop = initialHermesDesktop
  } else {
    delete desktopWindow.hermesDesktop
  }
})

// Leaving HUD mode hands the app window the session AND the keyboard: the
// user was typing in the HUD a moment ago, and a re-shown app window whose
// composer has no caret swallows the first keystrokes.
it('puts the caret back in the app composer when the HUD closes', () => {
  const resumeSession = vi.fn()

  renderHook(() => useHudHandoff({ navigate: vi.fn(), resumeSession }))

  expect(emitHudChanged).not.toBeNull()

  emitHudChanged?.({ open: true, sessionId: 's1' })
  expect(requestComposerFocus).not.toHaveBeenCalled()

  emitHudChanged?.({ open: false, sessionId: 's1' })
  expect(requestComposerFocus).toHaveBeenCalledOnce()
})
