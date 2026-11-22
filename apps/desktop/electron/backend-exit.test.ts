// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'

import { test, vi } from 'vitest'

import { waitForBackendExit } from './backend-child'

test('backend exit escalation rejects within its bound when no exit or close arrives', async (): Promise<void> => {
  vi.useFakeTimers()

  try {
    const child = Object.assign(new EventEmitter(), { exitCode: null, signalCode: null, kill: vi.fn() })

    const waiting = assert.rejects(
      waitForBackendExit(child, { forceKillProcessTree: (): void => {} }, 20),
      /did not exit/
    )

    await Promise.all([waiting, vi.advanceTimersByTimeAsync(1020)])
    assert.equal(child.exitCode, null)
    assert.equal(child.signalCode, null)
    assert.equal(child.kill.mock.calls.length, 1)
    assert.equal(child.kill.mock.calls[0][0], 'SIGKILL')
    assert.equal(child.listenerCount('exit'), 0)
    assert.equal(vi.getTimerCount(), 0)
  } finally {
    vi.useRealTimers()
  }
})

test('a failed escalation is not evidence that the child exited', async () => {
  vi.useFakeTimers()

  try {
    const child = Object.assign(new EventEmitter(), {
      exitCode: null,
      signalCode: null,
      kill: () => {
        throw new Error('signal denied')
      }
    })

    const outcome = waitForBackendExit(child, { forceKillProcessTree: () => {} }, 20).then(
      () => null,
      error => error
    )

    await vi.advanceTimersByTimeAsync(1020)
    assert.match(String(await outcome), /did not exit/)
    assert.equal(child.listenerCount('exit'), 0)
    assert.equal(vi.getTimerCount(), 0)
  } finally {
    vi.useRealTimers()
  }
})
