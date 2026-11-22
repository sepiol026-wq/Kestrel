// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { mapPool } from './pool'

describe('mapPool', () => {
  it('preserves input order regardless of completion order', async () => {
    const out = await mapPool([30, 10, 20], 3, async ms => {
      await new Promise(r => setTimeout(r, ms))

      return ms
    })

    expect(out).toEqual([30, 10, 20])
  })

  it('never exceeds the concurrency limit', async () => {
    let active = 0
    let peak = 0

    await mapPool([...Array(10).keys()], 3, async () => {
      active += 1
      peak = Math.max(peak, active)
      await new Promise(r => setTimeout(r, 5))
      active -= 1
    })

    expect(peak).toBeLessThanOrEqual(3)
  })
})
