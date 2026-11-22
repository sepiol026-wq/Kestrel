// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { createMainProcessLagWatchdog } from './main-process-lag-watchdog'

type TimerCallback = () => void
const TIMER = {} as ReturnType<typeof setInterval>

function harness({ now = 0, cadenceMs = 1_000, thresholdMs = 2_000 } = {}) {
  let clock = now
  let callback: TimerCallback | undefined
  let cleared: unknown
  const logs: string[] = []

  const watchdog = createMainProcessLagWatchdog({
    cadenceMs,
    now: () => clock,
    log: message => logs.push(message),
    setInterval: tick => {
      callback = tick

      return TIMER
    },
    clearInterval: timer => {
      cleared = timer
    },
    thresholdMs
  })

  return {
    watchdog,
    logs,
    tick: (at: number) => {
      clock = at
      callback?.()
    },
    cleared: () => cleared
  }
}

describe('createMainProcessLagWatchdog', () => {
  it('does not log while ticks arrive on their expected cadence', () => {
    const subject = harness()

    subject.watchdog.start()
    subject.tick(1_000)
    subject.tick(2_000)

    expect(subject.logs).toEqual([])
  })

  it('records actionable timing when a main-process tick arrives late', () => {
    const subject = harness()

    subject.watchdog.start()
    subject.tick(3_500)

    expect(subject.logs).toEqual([
      '[diagnostics] main-process event loop lagged 2500ms (expected tick at 1000ms, observed at 3500ms)'
    ])
  })

  it('cleans up its interval and does not log after stop', () => {
    const subject = harness()

    subject.watchdog.start()
    subject.watchdog.stop()
    subject.tick(5_000)

    expect(subject.cleared()).toBe(TIMER)
    expect(subject.logs).toEqual([])
  })

  it('is safe to stop during shutdown before it has started', () => {
    const subject = harness()

    subject.watchdog.stop()
    subject.watchdog.stop()

    expect(subject.cleared()).toBeUndefined()
  })
})
