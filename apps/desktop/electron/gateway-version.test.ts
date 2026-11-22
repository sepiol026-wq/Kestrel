// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import assert from 'node:assert/strict'

import { test } from 'vitest'

import { resolveGatewayVersion } from './gateway-version'

test('version follows each supplied gateway response without caching', async (): Promise<void> => {
  let version: string = '1.2.3'

  const request: (endpoint: string) => Promise<{ version: string }> = async (
    endpoint: string
  ): Promise<{ version: string }> => {
    assert.equal(endpoint, '/api/health')

    return { version }
  }

  assert.equal(await resolveGatewayVersion(request), '1.2.3')
  version = '4.5.6'
  assert.equal(await resolveGatewayVersion(request), '4.5.6')
})

test('unavailable gateway version stays unknown instead of using another install', async () => {
  for (const response of [null, {}, { version: 42 }, { version: '' }]) {
    assert.equal(await resolveGatewayVersion(async () => response), '')
  }

  assert.equal(
    await resolveGatewayVersion(async () => {
      throw new Error('offline')
    }),
    ''
  )
})

test('the distance past the release tag wins over the bare release', async (): Promise<void> => {
  const ahead: { version: string; displayVersion: string } = { version: '0.21.5', displayVersion: '0.21.5+1913' }
  assert.equal(await resolveGatewayVersion(async () => ahead), '0.21.5+1913')
  assert.equal(await resolveGatewayVersion(async () => ({ ...ahead, displayVersion: '' })), '0.21.5')
})
