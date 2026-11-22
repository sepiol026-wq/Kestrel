// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { shouldExitForSignal } from '../lib/gracefulExit.js'

describe('shouldExitForSignal', () => {
  it('ignores only the signals explicitly disabled for embedded dashboard chat', () => {
    expect(shouldExitForSignal('SIGINT', ['SIGINT'])).toBe(false)
    expect(shouldExitForSignal('SIGTERM', ['SIGINT'])).toBe(true)
    expect(shouldExitForSignal('SIGHUP', ['SIGINT'])).toBe(true)
  })
})
