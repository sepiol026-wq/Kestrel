// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Tests for connection-registry.ts::profileMetadataFromApiProfiles — the projection of a remote
 * connection's `/api/profiles` into the cross-connection roster metadata (#139548).
 */

import assert from 'node:assert/strict'

import { test } from 'vitest'

import { profileMetadataFromApiProfiles } from './connection-registry'

test('remote API profile descriptions are retained for the roster, including an empty description', () => {
  assert.deepEqual(
    profileMetadataFromApiProfiles([
      { name: 'builder', description: '  Personal project developer  ' },
      { name: 'empty', description: '' },
      { name: 'legacy', description: null }
    ]),
    {
      builder: { description: 'Personal project developer' },
      empty: { description: '' },
      legacy: {}
    }
  )
})
