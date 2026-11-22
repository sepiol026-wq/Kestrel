// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { INITIAL_STATE, parseMultipleKeypresses } from './parse-keypress.js'

// Confirm the control-byte split is a NO-OP for clean input (EVKey-style:
// backspace and recomposed text arrive in separate, non-fused reads). The
// fix must not change behavior for any text token that has no embedded
// control byte — otherwise it could regress IMEs that already work.
describe('control-byte split does not touch clean (EVKey-style) input', () => {
  it('a plain printable text token yields exactly one keypress (no spurious split)', () => {
    const [keys] = parseMultipleKeypresses(INITIAL_STATE, 'ạnh')

    expect(keys).toHaveLength(1)
    expect(keys[0]).toMatchObject({ raw: 'ạnh' })
  })

  it('separate clean reads (bs read, then text read) each produce one key', () => {
    const [k1] = parseMultipleKeypresses(INITIAL_STATE, '\x7f')
    const [k2] = parseMultipleKeypresses(INITIAL_STATE, 'ô')

    expect(k1).toHaveLength(1)
    expect(k1[0]).toMatchObject({ name: 'backspace' })
    expect(k2).toHaveLength(1)
    expect(k2[0]).toMatchObject({ raw: 'ô' })
  })
})
