// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { parseListFieldDraft } from './config-field'

describe('parseListFieldDraft', () => {
  it('commits comma-separated list values after editing', () => {
    expect(parseListFieldDraft('C:/gitLibraries, C:/gitProjects')).toEqual(['C:/gitLibraries', 'C:/gitProjects'])
  })

  it('trims entries and drops empty segments', () => {
    expect(parseListFieldDraft(' one, , two,   ')).toEqual(['one', 'two'])
  })

  it('allows an unfinished trailing comma to remain draft-only until commit', () => {
    expect(parseListFieldDraft('first,')).toEqual(['first'])
  })
})
