// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { beforeEach, describe, expect, it } from 'vitest'

import { getOverlayState, resetOverlayState } from '../app/overlayStore.js'
import { findSlashCommand } from '../app/slash/registry.js'

describe('/journey slash command', () => {
  beforeEach(() => {
    resetOverlayState()
  })

  it('opens the journey overlay when run', () => {
    expect(getOverlayState().journey).toBe(false)
    findSlashCommand('journey')!.run('', {} as never, 'journey')
    expect(getOverlayState().journey).toBe(true)
  })

  it('is preserved by the flow-overlay soft reset (deliberate, user-opened)', async () => {
    findSlashCommand('journey')!.run('', {} as never, 'journey')
    // Mirror turnController.idle(): flow overlays clear, user-opened panels stay.
    const { resetFlowOverlays } = await import('../app/overlayStore.js')
    resetFlowOverlays()
    expect(getOverlayState().journey).toBe(true)
  })
})
