// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import assert from 'node:assert/strict'

import { test } from 'vitest'

import { applyHudElectronOverlay } from './hud-overlay'

test('macOS uses the floating window level and all-spaces visibility', () => {
  const calls: string[] = []

  const win = {
    setAlwaysOnTop(flag: boolean, level?: string) {
      calls.push(`alwaysOnTop:${flag}:${level}`)
    },
    setVisibleOnAllWorkspaces(visible: boolean, options?: { visibleOnFullScreen?: boolean }) {
      calls.push(`allWorkspaces:${visible}:${options?.visibleOnFullScreen === true}`)
    }
  }

  applyHudElectronOverlay(win, 'darwin')

  assert.deepEqual(calls, ['alwaysOnTop:true:floating', 'allWorkspaces:true:true'])
})

test('Linux and Windows only set the screen-saver always-on-top level', () => {
  for (const platform of ['linux', 'win32']) {
    const calls: string[] = []

    const win = {
      setAlwaysOnTop(flag: boolean, level?: string) {
        calls.push(`alwaysOnTop:${flag}:${level}`)
      },
      setVisibleOnAllWorkspaces() {
        calls.push('allWorkspaces')
      }
    }

    applyHudElectronOverlay(win, platform)

    assert.deepEqual(calls, ['alwaysOnTop:true:screen-saver'])
  }
})
