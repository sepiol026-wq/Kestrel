// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import assert from 'node:assert/strict'

import { test } from 'vitest'

import { waitForUpdateClearance } from './update-gate'

test('quit interrupts an update-gated wait instead of waiting for the next poll', async () => {
  const controller = new AbortController()
  let slept = false

  const waiting = waitForUpdateClearance(
    { hasLiveMarker: () => true, isUpdateInFlight: () => false, isHandoffActive: () => false },
    {
      signal: controller.signal,
      pollMs: 1000,
      timeoutMs: 120000,
      sleep: () => {
        slept = true

        return new Promise(() => {})
      }
    }
  )

  let outcome: unknown
  void waiting.then(result => {
    outcome = result
  })

  for (let i = 0; i < 10; i++) {
    await Promise.resolve()
  }

  assert.equal(slept, true)
  controller.abort()

  for (let i = 0; i < 20; i++) {
    await Promise.resolve()
  }

  assert.equal(outcome, 'cancelled')
})
