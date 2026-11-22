// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { deepLinkRegistersBeforeSingleInstanceLock, preReadyDockLaunchSteps } from './dock-launch-order'

describe('macOS Dock launch order', () => {
  it('registers the deep link before the single-instance lock', () => {
    expect(preReadyDockLaunchSteps('darwin')).toEqual(['register-deep-link', 'single-instance-lock'])
    expect(deepLinkRegistersBeforeSingleInstanceLock('darwin')).toBe(true)
  })

  it('keeps non-macOS platforms on the lock at module load, with no Dock race', () => {
    for (const platform of ['win32', 'linux', 'freebsd']) {
      expect(preReadyDockLaunchSteps(platform)).toEqual(['single-instance-lock'])
      expect(deepLinkRegistersBeforeSingleInstanceLock(platform)).toBe(false)
    }
  })
})
