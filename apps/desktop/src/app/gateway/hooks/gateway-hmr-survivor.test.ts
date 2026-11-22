// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { afterEach, describe, expect, it } from 'vitest'

import {
  type GatewaySurvivor,
  stashGatewaySurvivor,
  survivorIsStale,
  takeGatewaySurvivor
} from './gateway-hmr-survivor'

// A minimal stand-in for HermesGateway: the survivor cache only reads
// `connectionState`. Cast through unknown so we don't drag the whole class in.
function fakeGateway(state: 'idle' | 'connecting' | 'open' | 'closed' | 'error') {
  return { connectionState: state } as unknown as GatewaySurvivor['gateway']
}

function makeSurvivor(state: Parameters<typeof fakeGateway>[0]): GatewaySurvivor {
  return { gateway: fakeGateway(state), profile: 'default', connection: null }
}

afterEach(() => {
  // Drain any survivor a test parked but didn't take, so cases don't leak across
  // the shared globalThis slot.
  takeGatewaySurvivor()
})

describe('gateway HMR survivor cache', () => {
  it('is single-shot — a second take returns null', () => {
    stashGatewaySurvivor(makeSurvivor('open'))
    expect(takeGatewaySurvivor()).not.toBeNull()
    expect(takeGatewaySurvivor()).toBeNull()
  })

  it('persists across re-imports via the globalThis slot', async () => {
    const survivor = makeSurvivor('open')
    stashGatewaySurvivor(survivor)

    // A fresh import of the module (simulating an HMR module swap) must resolve
    // the same underlying store, not a reset one.
    const reimported = await import('./gateway-hmr-survivor')
    expect(reimported.takeGatewaySurvivor()).toBe(survivor)
  })

  it('treats open / connecting sockets as adoptable', () => {
    expect(survivorIsStale(makeSurvivor('open'))).toBe(false)
    expect(survivorIsStale(makeSurvivor('connecting'))).toBe(false)
  })

  it('treats closed / error / idle sockets as stale', () => {
    expect(survivorIsStale(makeSurvivor('closed'))).toBe(true)
    expect(survivorIsStale(makeSurvivor('error'))).toBe(true)
    expect(survivorIsStale(makeSurvivor('idle'))).toBe(true)
  })

  it('returns a stale survivor from take() so the caller can close it', () => {
    const dead = makeSurvivor('closed')
    stashGatewaySurvivor(dead)
    const taken = takeGatewaySurvivor()
    expect(taken).toBe(dead)
    expect(taken && survivorIsStale(taken)).toBe(true)
  })
})
