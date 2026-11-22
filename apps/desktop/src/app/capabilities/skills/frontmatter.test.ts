// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { parseFrontmatter } from './frontmatter'

describe('parseFrontmatter', () => {
  it('splits the leading YAML block from the body', () => {
    const { body, meta } = parseFrontmatter('---\nname: web-research\nversion: 1.2.0\n---\n\n# Web Research\n\nSteps.')

    expect(meta).toEqual([
      ['name', 'web-research'],
      ['version', '1.2.0']
    ])
    expect(body.trim()).toBe('# Web Research\n\nSteps.')
  })

  it('keeps a nested block with its key, de-indented one level', () => {
    const { meta } = parseFrontmatter('---\nallowed-tools:\n  - Read\n  - Write\nname: x\n---\nbody')

    expect(meta).toEqual([
      ['allowed-tools', '- Read\n- Write'],
      ['name', 'x']
    ])
  })

  it('returns the whole content as body when there is no frontmatter', () => {
    expect(parseFrontmatter('# Just a skill')).toEqual({ body: '# Just a skill', meta: [] })
  })
})
