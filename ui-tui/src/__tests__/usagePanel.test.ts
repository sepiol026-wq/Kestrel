// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { planUsageLines } from '../app/slash/usagePanel.js'

const plan = (left_fraction: number) =>
  ({ gauges: [{ label: 'day', left_fraction, style: 'bar', title: 'Today' }], kind: 'usage_window' }) as never

describe('planUsageLines', () => {
  it('a nearly full allowance reads 99% beside its 9 cells, like the CLI and Desktop', () => {
    expect(planUsageLines(plan(0.00004))).toEqual(['Today  [||||||||| ]  99% used'])
  })

  it('100% only once the allowance is spent', () => {
    expect(planUsageLines(plan(0))).toEqual(['Today  [||||||||||]  100% used'])
  })
})
