// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { shortVersion } from './version-label'

describe('shortVersion', () => {
  it('keeps the distance past the release and drops the commit', (): void => {
    expect(shortVersion('0.21.5+1913.gf83a9e9')).toBe('0.21.5+1913')
    expect(shortVersion('v0.21.5+1913.gf83a9e9.dirty')).toBe('0.21.5+1913')
    expect(shortVersion('0.21.5+1913')).toBe('0.21.5+1913')
    expect(shortVersion('0.21.5')).toBe('0.21.5')
  })
})
