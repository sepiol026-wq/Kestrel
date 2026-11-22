// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { resolvePluginSourceLinks } from './plugin-source-urls'

describe('resolvePluginSourceLinks', () => {
  it('maps owner/repo to github browse and clone urls', () => {
    expect(resolvePluginSourceLinks('NousResearch/hermes-example-plugins')).toEqual({
      gitUrl: 'https://github.com/NousResearch/hermes-example-plugins.git',
      browseUrl: 'https://github.com/NousResearch/hermes-example-plugins',
      subdir: null
    })
  })

  it('includes monorepo subdir in browse url', () => {
    expect(resolvePluginSourceLinks('owner/repo/plugins/foo')).toEqual({
      gitUrl: 'https://github.com/owner/repo.git',
      browseUrl: 'https://github.com/owner/repo/tree/HEAD/plugins/foo',
      subdir: 'plugins/foo'
    })
  })

  it('supports git@ github urls', () => {
    expect(resolvePluginSourceLinks('git@github.com:owner/my-plugin.git')).toEqual({
      gitUrl: 'git@github.com:owner/my-plugin.git',
      browseUrl: 'https://github.com/owner/my-plugin',
      subdir: null
    })
  })

  it('returns null for invalid identifiers', () => {
    expect(resolvePluginSourceLinks('not-a-repo')).toBeNull()
  })
})
