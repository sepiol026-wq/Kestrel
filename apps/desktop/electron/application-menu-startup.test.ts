// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import assert from 'node:assert/strict'

import { test } from 'vitest'

import { installApplicationMenuAfterFirstWindow } from './application-menu-startup'

// #115332: a key equivalent routed through the application menu's delegate
// before any window exists segfaults the macOS shell on the updater relaunch.
function record(isMac: boolean) {
  const order: string[] = []

  installApplicationMenuAfterFirstWindow<string>({
    isMac,
    buildMenu: () => {
      order.push('build-menu')

      return 'menu'
    },
    setApplicationMenu: menu => order.push(`set-menu:${menu}`),
    createWindow: () => order.push('create-window')
  })

  return order
}

test('macOS installs the application menu only after the first window exists', () => {
  assert.deepEqual(record(true), ['create-window', 'build-menu', 'set-menu:menu'])
})

test('other platforms create the window and never build an application menu', () => {
  assert.deepEqual(record(false), ['create-window'])
})
