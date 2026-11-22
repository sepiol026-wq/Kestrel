// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { gitRef, slug } from './sanitize'

describe('gitRef', () => {
  it('turns spaces into hyphens and keeps slashes', () => {
    expect(gitRef('beach vibes')).toBe('beach-vibes')
    expect(gitRef('feat/cool thing')).toBe('feat/cool-thing')
  })

  it('drops chars git refs forbid and collapses separators', () => {
    expect(gitRef('wip~^:?*[]')).toBe('wip')
    expect(gitRef('a   b///c..d')).toBe('a-b/c.d')
  })

  it('strips a leading separator but stays typeable (keeps a trailing one)', () => {
    expect(gitRef('/foo')).toBe('foo')
    expect(gitRef('feat/')).toBe('feat/')
  })
})

describe('slug', () => {
  it('lowercases and kebabs runs of non-alphanumerics', () => {
    expect(slug('My Profile')).toBe('my-profile')
    expect(slug('a__b  c')).toBe('a-b-c')
  })

  it('strips a leading separator but keeps a trailing one while typing', () => {
    expect(slug('--x')).toBe('x')
    expect(slug('work ')).toBe('work-')
  })
})
