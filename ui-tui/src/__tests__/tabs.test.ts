// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { $codeRuns, MAX_TAB_LABEL, noteCodeEnd, noteCodeStart, resetCodeRuns, tabWindow } from '../app/tabStore.js'

describe('tabWindow', () => {
  it('shows every tab when the strip fits', () => {
    expect(tabWindow(['a', 'b', 'c'], 1, 80)).toMatchObject({ end: 3, hiddenLeft: 0, hiddenRight: 0, start: 0 })
  })

  it('keeps the selected tab visible and reports the hidden sides', () => {
    const win = tabWindow(['alpha', 'beta', 'gamma', 'delta', 'epsilon'], 4, 12)

    expect(win.start).toBeLessThanOrEqual(4)
    expect(win.end).toBe(5)
    expect(win.hiddenLeft).toBeGreaterThan(0)
    expect(win.hiddenRight).toBe(0)
  })

  it('never exceeds the width it was given', () => {
    const labels = Array.from({ length: 20 }, (_, i) => `session-number-${i}`)
    const win = tabWindow(labels, 10, 40)
    const used = win.labels.slice(win.start, win.end).reduce((sum, label) => sum + label.length + 3, 0)

    expect(used).toBeLessThanOrEqual(40)
    expect(win.hiddenRight).toBeGreaterThan(0)
  })

  it('ellipsizes a label longer than the per-tab cap', () => {
    const long = 'x'.repeat(MAX_TAB_LABEL + 10)

    expect(tabWindow([long], 0, 80).labels[0]!.length).toBe(MAX_TAB_LABEL)
  })
})

describe('code run ring', () => {
  it('records code-ish tools only, then attaches the result in place', () => {
    resetCodeRuns()
    noteCodeStart('t1', 'web_search', 'query')
    noteCodeStart('t2', 'execute_code', 'print(1)')
    expect($codeRuns.get().map(run => run.id)).toEqual(['t2'])

    noteCodeEnd('t2', '1')
    expect($codeRuns.get()[0]).toMatchObject({ output: '1', running: false })
    resetCodeRuns()
  })

  it('ignores a completion for a run it never saw', () => {
    resetCodeRuns()
    noteCodeEnd('ghost', 'x')
    expect($codeRuns.get()).toEqual([])
  })
})
