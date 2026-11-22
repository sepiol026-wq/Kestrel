// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { auxTaskRows } from './aux-task-rows'

describe('auxTaskRows', () => {
  it('does not offer the retired skills_hub slot (#40703)', () => {
    const keys = auxTaskRows([{ base_url: '', model: '', provider: 'auto', task: 'vision' }]).map(row => row.key)

    expect(keys).toContain('vision')
    expect(keys).not.toContain('skills_hub')
  })
})
