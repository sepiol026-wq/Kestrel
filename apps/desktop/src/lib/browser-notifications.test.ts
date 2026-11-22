// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { onBrowserFocusSession, showBrowserNotification } from './browser-notifications'

const created: { onclick: (() => void) | null; title: string }[] = []

class FakeNotification {
  static permission: NotificationPermission = 'default'
  static requestPermission = vi.fn(async () => FakeNotification.permission)
  onclick: (() => void) | null = null
  constructor(public title: string) {
    created.push(this)
  }
  close() {}
}

describe('showBrowserNotification', () => {
  beforeEach(() => {
    created.length = 0
    FakeNotification.requestPermission.mockClear()
    vi.stubGlobal('Notification', FakeNotification)
    vi.stubGlobal('isSecureContext', true)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('never asks for permission from an event (only a click in Settings may)', () => {
    FakeNotification.permission = 'default'

    expect(showBrowserNotification({ kind: 'approval', sessionId: 's1', title: 'Approval needed' })).toBe(false)
    expect(FakeNotification.requestPermission).not.toHaveBeenCalled()
    expect(created).toHaveLength(0)
  })

  it('opens the notified session through onFocusSession when clicked', () => {
    FakeNotification.permission = 'granted'
    const opened: string[] = []
    const off = onBrowserFocusSession(id => opened.push(id))
    const focus = vi.spyOn(window, 'focus').mockImplementation(() => undefined)

    expect(
      showBrowserNotification({ focusSessionId: 'stored-1', kind: 'approval', sessionId: 'rt-1', title: 'Approval needed' })
    ).toBe(true)
    created[0].onclick?.()

    expect(focus).toHaveBeenCalled()
    expect(opened).toEqual(['stored-1'])
    off()
  })
})
