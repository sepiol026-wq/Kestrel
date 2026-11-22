// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { beforeEach, describe, expect, it } from 'vitest'

import {
  $activeTip,
  $retiredTips,
  $tipShownAt,
  agentTipId,
  dismissTip,
  resetTips,
  retireActiveTip,
  showTip
} from './tips'

const showAgentTip = (selector: string, text: string) => {
  showTip({
    side: 'top',
    targets: [selector],
    text,
    tipId: agentTipId(selector, text)
  })
}

beforeEach(() => {
  dismissTip()
  resetTips()
})

describe('agent tip retirement', () => {
  it('does not show the same agent tip again after the user retires it', () => {
    showAgentTip('[data-tour="model-pill"]', 'Choose a model here.')
    const tipId = $activeTip.get()?.tipId

    retireActiveTip()
    showAgentTip('[data-tour="model-pill"]', 'Choose a model here.')

    expect(tipId).toBe(agentTipId('[data-tour="model-pill"]', 'Choose a model here.'))
    expect(tipId).not.toContain('Choose a model here.')
    expect($retiredTips.get()).toContain(tipId)
    expect($activeTip.get()).toBeNull()
    // Only the ✕ persists for agent tips; the seen ledger stays catalog-only.
    expect($tipShownAt.get()).toEqual({})
  })
})
