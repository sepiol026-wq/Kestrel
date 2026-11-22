// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import assert from 'node:assert/strict'

import { test } from 'vitest'

import { enableRendererAccessibility, shouldEnableRendererAccessibility } from './renderer-accessibility'

test('shouldEnableRendererAccessibility is on by default on the typed platforms', () => {
  assert.equal(shouldEnableRendererAccessibility({}, 'darwin'), true)
  assert.equal(shouldEnableRendererAccessibility({}, 'win32'), true)
})

test('shouldEnableRendererAccessibility never enables on platforms without the typed API', () => {
  // Linux AT reaches the renderer through the platform's ATK stack, not
  // through app.setAccessibilitySupportEnabled.
  assert.equal(shouldEnableRendererAccessibility({}, 'linux'), false)
})

test('shouldEnableRendererAccessibility honors the opt-out env bridge', () => {
  for (const off of ['0', 'false', 'no', 'off', 'OFF', ' 0 ', 'disabled', ' Disabled ']) {
    assert.equal(shouldEnableRendererAccessibility({ HERMES_DESKTOP_RENDERER_ACCESSIBILITY: off }, 'darwin'), false)
    assert.equal(shouldEnableRendererAccessibility({ HERMES_DESKTOP_RENDERER_ACCESSIBILITY: off }, 'win32'), false)
  }

  // Absent, empty, or a positive value keeps the feature on.
  assert.equal(shouldEnableRendererAccessibility({ HERMES_DESKTOP_RENDERER_ACCESSIBILITY: undefined }, 'darwin'), true)
  assert.equal(shouldEnableRendererAccessibility({ HERMES_DESKTOP_RENDERER_ACCESSIBILITY: '' }, 'win32'), true)
  assert.equal(shouldEnableRendererAccessibility({ HERMES_DESKTOP_RENDERER_ACCESSIBILITY: '1' }, 'darwin'), true)
})

test('enableRendererAccessibility flips the injected Electron switch exactly when enabled', () => {
  const recorded: boolean[] = []
  const appApi = { setAccessibilitySupportEnabled: (enabled: boolean) => recorded.push(enabled) }

  enableRendererAccessibility({ appApi, env: {}, platform: 'darwin' })
  enableRendererAccessibility({ appApi, env: {}, platform: 'win32' })
  enableRendererAccessibility({ appApi, env: { HERMES_DESKTOP_RENDERER_ACCESSIBILITY: '0' }, platform: 'darwin' })
  enableRendererAccessibility({ appApi, env: {}, platform: 'linux' })

  assert.deepEqual(recorded, [true, true])
})
