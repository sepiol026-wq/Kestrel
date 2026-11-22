// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { sharedGatewayProfiles } from './shared-gateway-restart'

describe('sharedGatewayProfiles', () => {
  it('lists every bot the shared multiplexer carries, default first, when the profile is served', () => {
    expect(sharedGatewayProfiles({ gateway_shared_with: ['beta', 'alpha', 'default'] })).toEqual([
      'default',
      'alpha',
      'beta'
    ])
  })

  it('keeps the plain restart for standalone gateways and older backends', () => {
    // Standalone profile: the backend answers null.
    expect(sharedGatewayProfiles({ gateway_shared_with: null })).toBeNull()
    // Older backend: the key does not exist at all.
    expect(sharedGatewayProfiles({})).toBeNull()
    expect(sharedGatewayProfiles(null)).toBeNull()
    // A multiplexer carrying nobody else restarts only itself: no "all bots" copy.
    expect(sharedGatewayProfiles({ gateway_shared_with: ['default'] })).toBeNull()
  })
})
