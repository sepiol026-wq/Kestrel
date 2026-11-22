// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { clarifySettledRows } from '../app/clarifyTranscript.js'

describe('clarifySettledRows', () => {
  it("writes main's `question → answer` bubble and the `1 question` tool row for one card (row 8)", () => {
    const rows = clarifySettledRows([{ qid: 'p1', question: 'Pick a colour?' }], { p1: 'red (Recommended)' })

    expect(rows.userText).toBe('Pick a colour? → red (Recommended)')
    expect(rows.trail).toContain('1 question')
    expect(rows.trail).not.toContain('Pick a colour?')
  })

  it('reads a blank answer as skipped', () => {
    expect(clarifySettledRows([{ qid: 'p1', question: 'Name?' }], { p1: ' ' }).userText).toMatch(/^Name\? → /)
  })
})
