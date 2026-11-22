// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import assert from 'node:assert/strict'

import { test, vi } from 'vitest'

// terminal-ipc.ts imports the Electron and native PTY modules at module scope;
// neither loads under plain node, and this test only needs the pure locale helper.
vi.mock('electron', () => ({ app: {}, ipcMain: {} }))
vi.mock('node-pty', () => ({ default: {} }))

import { terminalLcCtype } from './terminal-ipc'

test('terminalLcCtype never hands glibc the bare "UTF-8" locale on Linux', () => {
  assert.equal(terminalLcCtype({ LANG: 'en_US.UTF-8' }, 'linux'), 'en_US.UTF-8')
  assert.equal(terminalLcCtype({}, 'linux'), 'C.UTF-8')
  assert.equal(terminalLcCtype({ LANG: 'en_US.UTF-8', LC_CTYPE: 'de_DE.UTF-8' }, 'linux'), 'de_DE.UTF-8')
  assert.equal(terminalLcCtype({ LANG: 'en_US.UTF-8' }, 'darwin'), 'UTF-8')
})
