// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { movedSettingsTabRedirect } from './moved-tabs'

describe('movedSettingsTabRedirect', () => {
  it('sends the retired Settings MCP tab to Capabilities, keeping the row selector', () => {
    expect(movedSettingsTabRedirect('?tab=mcp&server=github')).toBe('/capabilities?tab=connectors&server=github')
  })

  it('leaves live Settings tabs alone', () => {
    // `tab=plugins` is live again: Settings ▸ Plugins hosts every plugin's
    // own settings pages (the inventory stays in Capabilities ▸ Plugins).
    expect(movedSettingsTabRedirect('?tab=plugins&plugin=agent%3Anotes')).toBeNull()
    expect(movedSettingsTabRedirect('?tab=providers&pview=keys')).toBeNull()
    expect(movedSettingsTabRedirect('')).toBeNull()
  })
})
