// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import assert from 'node:assert/strict'

import { test } from 'vitest'

import { resolveNotificationAction } from './notification-actions'

const actions = [
  { id: 'approve', text: 'Approve' },
  { id: 'reject', text: 'Reject' }
]

test('prefers Electron event details and supports the legacy positional index', () => {
  assert.deepEqual(resolveNotificationAction(actions, { actionIndex: 1 }, undefined), actions[1])
  assert.deepEqual(resolveNotificationAction(actions, {}, 0), actions[0])
  assert.deepEqual(resolveNotificationAction(actions, { actionIndex: 1 }, 0), actions[1])
})

test('ignores missing and out-of-range action indexes', () => {
  assert.equal(resolveNotificationAction(actions, {}, undefined), null)
  assert.equal(resolveNotificationAction(actions, { actionIndex: -1 }, undefined), null)
  assert.equal(resolveNotificationAction(actions, { actionIndex: 2 }, undefined), null)
})
