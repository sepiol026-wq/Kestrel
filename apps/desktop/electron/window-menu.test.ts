// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import assert from 'node:assert/strict'

import { test } from 'vitest'

import { windowMenuTemplate } from './window-menu'

test('macOS registers the native Window menu so AppKit window commands remain available', () => {
  const menu = windowMenuTemplate(true)

  assert.equal(menu.role, 'windowMenu')
  assert.deepEqual(
    menu.submenu.map(item => item.role),
    ['minimize', 'zoom', 'front']
  )
})

test('non-macOS keeps the explicit cross-platform Window menu', () => {
  const menu = windowMenuTemplate(false)

  assert.equal(menu.label, 'Window')
  assert.deepEqual(
    menu.submenu.map(item => item.role),
    ['minimize', undefined]
  )
  assert.equal(menu.submenu[1].label, 'Close')
})
