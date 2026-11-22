// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { $activeTip, $retiredTips, $tipsEnabled, dismissTip, resetTips, retireActiveTip } from '@/store/tips'

import { handleDesktopBridgeEvent } from './desktop-bridge'
import type { GatewayEventContext } from './types'

vi.mock('@/app/right-sidebar/terminal/agent-terminal-stream', () => ({ writeAgentTerminalChunk: vi.fn() }))
vi.mock('@/app/right-sidebar/terminal/terminals', () => ({ closeAgentTerminalByProc: vi.fn() }))
vi.mock('@/store/pane-focus', () => ({ applyDesktopLayoutPreset: vi.fn(), revealDesktopPane: vi.fn() }))
vi.mock('@/store/reactions-local', () => ({ recordAgentReaction: vi.fn() }))
vi.mock('@/store/session', () => ({ setMessages: vi.fn() }))

const tipShow = (text: string): GatewayEventContext =>
  ({
    event: { type: 'tip.show' },
    isActiveEvent: true,
    payload: { selector: '[data-tour="model-pill"]', text }
  }) as unknown as GatewayEventContext

beforeEach(() => {
  dismissTip()
  resetTips()
  $tipsEnabled.set(true)
})

describe('tip.show bridge (#117216)', () => {
  it('a ✕-closed agent tip does not come back on the next tip.show of the same content', () => {
    handleDesktopBridgeEvent(tipShow('Choose a model here.'))
    const tipId = $activeTip.get()?.tipId

    expect(tipId).toMatch(/^agent:/)

    retireActiveTip()
    expect($retiredTips.get()).toContain(tipId)

    handleDesktopBridgeEvent(tipShow('Choose a model here.'))
    expect($activeTip.get()).toBeNull()

    // Different content is a different tip and still shows.
    handleDesktopBridgeEvent(tipShow('Attach files with the paperclip.'))
    expect($activeTip.get()?.text).toBe('Attach files with the paperclip.')
  })
})
