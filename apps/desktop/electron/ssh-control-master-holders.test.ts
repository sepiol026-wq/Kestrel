// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import assert from 'node:assert/strict'

import { test } from 'vitest'

import { controlMasterCloseAction, createControlMasterHolders } from './ssh-control-master-holders'

test('controlMasterCloseAction exits the master only for the last holder', () => {
  assert.equal(controlMasterCloseAction(0), 'exit-master')
  assert.equal(controlMasterCloseAction(1), 'release-only')
  assert.equal(controlMasterCloseAction(3), 'release-only')
})

test('holders are counted per ControlPath and released in any order', () => {
  const holders = createControlMasterHolders()
  const older = {}
  const newer = {}
  const elsewhere = {}

  holders.acquire('/s/a.sock', older)
  holders.acquire('/s/a.sock', newer)
  holders.acquire('/s/b.sock', elsewhere)

  assert.equal(holders.release('/s/a.sock', older), 'release-only', 'older closer leaves the newer holder its master')
  assert.equal(holders.release('/s/a.sock', newer), 'exit-master')
  assert.equal(holders.count('/s/a.sock'), 0)
  assert.equal(holders.count('/s/b.sock'), 1, 'other sockets are unaffected')
})

test('re-acquiring and double-releasing are idempotent', () => {
  const holders = createControlMasterHolders()
  const conn = {}

  holders.acquire('/s/a.sock', conn)
  holders.acquire('/s/a.sock', conn)
  assert.equal(holders.count('/s/a.sock'), 1)
  assert.equal(holders.release('/s/a.sock', conn), 'exit-master')
  assert.equal(holders.release('/s/a.sock', conn), 'exit-master', 'releasing an unknown holder never blocks a close')
})

test('an empty ControlPath (no-mux) is never tracked', () => {
  const holders = createControlMasterHolders()

  holders.acquire('', {})
  assert.equal(holders.count(''), 0)
})
