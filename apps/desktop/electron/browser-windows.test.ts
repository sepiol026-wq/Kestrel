// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import assert from 'node:assert/strict'

import { test } from 'vitest'

import { buildBrowserWindowUrl } from './browser-windows'

test('buildBrowserWindowUrl puts win=browser before the hash (dev server)', () => {
  const url = buildBrowserWindowUrl('url:browser-1', { devServer: 'http://localhost:5173' })

  assert.equal(url, 'http://localhost:5173/?win=browser&tab=url%3Abrowser-1#/')
  assert.ok(url.indexOf('?win=browser') < url.indexOf('#'))
})

test('buildBrowserWindowUrl encodes the tab id', () => {
  const url = buildBrowserWindowUrl('url:browser a/b', { devServer: 'http://localhost:5173' })

  assert.equal(url, 'http://localhost:5173/?win=browser&tab=url%3Abrowser%20a%2Fb#/')
})

test('buildBrowserWindowUrl avoids a double slash when the dev server has a trailing slash', () => {
  const url = buildBrowserWindowUrl('t', { devServer: 'http://localhost:5173/' })

  assert.equal(url, 'http://localhost:5173/?win=browser&tab=t#/')
})

test('buildBrowserWindowUrl omits a blank tab', () => {
  assert.equal(
    buildBrowserWindowUrl('  ', { devServer: 'http://localhost:5173' }),
    'http://localhost:5173/?win=browser#/'
  )
  assert.equal(
    buildBrowserWindowUrl(null, { devServer: 'http://localhost:5173' }),
    'http://localhost:5173/?win=browser#/'
  )
})

test('buildBrowserWindowUrl builds a packaged file URL with the flag before the hash', () => {
  const url = buildBrowserWindowUrl('abc', { rendererIndexPath: '/opt/app/index.html' })

  assert.match(url, /^file:\/\/.*index\.html\?win=browser&tab=abc#\/$/)
})
