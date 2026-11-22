// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Tests for OAuth-session Electron net.request helpers.
 *
 * Run with: node --test electron/oauth-net-request.test.ts
 */

import assert from 'node:assert/strict'

import { test } from 'vitest'

import { serializeJsonBody, setJsonRequestHeaders } from './oauth-net-request'

test('serializeJsonBody returns undefined for absent bodies', () => {
  assert.equal(serializeJsonBody(undefined), undefined)
})

test('serializeJsonBody JSON-encodes request bodies', () => {
  const body = serializeJsonBody({ archived: true })
  assert.ok(Buffer.isBuffer(body))
  assert.equal(body.toString('utf8'), '{"archived":true}')
})

test('setJsonRequestHeaders does not set Electron-restricted Content-Length', () => {
  const headers = []

  const request = {
    setHeader(name, value) {
      headers.push([name, value])
    }
  }

  setJsonRequestHeaders(request)

  assert.deepEqual(headers, [['Content-Type', 'application/json']])
  assert.equal(
    headers.some(([name]) => name.toLowerCase() === 'content-length'),
    false
  )
})
