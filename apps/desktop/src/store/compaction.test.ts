// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { $compactingSessions, sessionCompacting, setSessionCompacting } from './compaction'

describe('compaction store', () => {
  beforeEach(() => $compactingSessions.set({}))

  afterEach(() => $compactingSessions.set({}))

  it('tracks session ids that collide with object prototype keys', () => {
    expect(sessionCompacting('toString').get()).toBe(false)

    setSessionCompacting('toString', true)

    expect(Object.hasOwn($compactingSessions.get(), 'toString')).toBe(true)
    expect(sessionCompacting('toString').get()).toBe(true)
  })

  it('scopes the view to the session asked for, not whichever is active', () => {
    setSessionCompacting('session-a', true)

    expect(sessionCompacting('session-a').get()).toBe(true)
    expect(sessionCompacting('session-b').get()).toBe(false)
  })

  it('clears a session without disturbing the others', () => {
    setSessionCompacting('session-a', true)
    setSessionCompacting('session-b', true)

    setSessionCompacting('session-a', false)

    expect($compactingSessions.get()).toEqual({ 'session-b': true })
  })
})
