// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { resolveTierArt } from './tier-art'

describe('resolveTierArt', () => {
  it('keys art by lowercase tier name, case-insensitively', () => {
    for (const name of ['Free', 'starter', 'Plus', 'SUPER', 'ultra']) {
      expect(resolveTierArt(name)).not.toBeNull()
    }
  })

  it('returns null for unknown or missing names so the card renders text-only', () => {
    expect(resolveTierArt('Mystery')).toBeNull()
    expect(resolveTierArt('')).toBeNull()
    expect(resolveTierArt(null)).toBeNull()
    expect(resolveTierArt(undefined)).toBeNull()
  })
})
