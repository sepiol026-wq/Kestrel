// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { $sessions, _resetSessionOwnerHintsForTests, getSessionOwnerHint, setSessionOwnerHint } from '@/store/session'
import type { SessionInfo } from '@/types/hermes'

import { rememberedOwnerForResume } from './remembered-owner'

const REMOTE = { connectionId: 'ssh-proxmox', profile: 'bot' }

describe('rememberedOwnerForResume', () => {
  beforeEach(() => {
    _resetSessionOwnerHintsForTests({ storage: true })
    $sessions.set([])
  })

  afterEach(() => {
    _resetSessionOwnerHintsForTests({ storage: true })
    $sessions.set([])
  })

  it('keeps the hint of a session with no row (hidden Bot Chat)', () => {
    setSessionOwnerHint('stored-1', REMOTE)

    expect(rememberedOwnerForResume('stored-1')).toMatchObject(REMOTE)
    expect(getSessionOwnerHint('stored-1')).toMatchObject(REMOTE)
  })

  it('drops a hint an untagged row contradicts (#97809)', () => {
    setSessionOwnerHint('stored-1', REMOTE)
    $sessions.set([{ id: 'stored-1' } as SessionInfo])

    expect(rememberedOwnerForResume('stored-1')).toBeUndefined()
    expect(getSessionOwnerHint('stored-1')).toBeUndefined()
  })
})
