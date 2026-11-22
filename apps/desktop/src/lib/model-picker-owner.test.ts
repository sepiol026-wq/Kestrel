// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { resolveModelPickerOwner } from './model-picker-owner'

describe('resolveModelPickerOwner', () => {
  it('keeps an active-A focused-B picker on the focused tile owner', () => {
    expect(
      resolveModelPickerOwner({
        ambientConnectionId: 'connection-a',
        ambientProfile: 'profile-a',
        focusedStoredSessionId: 'stored-b',
        selectedStoredSessionId: 'stored-a',
        sessionTiles: [
          {
            ownerRoute: {
              connectionId: 'connection-b',
              profile: 'desktop-b',
              targetProfile: 'backend-b'
            },
            storedSessionId: 'stored-b'
          }
        ]
      })
    ).toEqual({
      connectionId: 'connection-b',
      profile: 'backend-b',
      route: {
        connectionId: 'connection-b',
        profile: 'desktop-b',
        targetProfile: 'backend-b'
      }
    })
  })

  it('uses the ambient owner when the primary session is focused', () => {
    expect(
      resolveModelPickerOwner({
        ambientConnectionId: 'connection-a',
        ambientProfile: 'profile-a',
        focusedStoredSessionId: 'stored-a',
        selectedStoredSessionId: 'stored-a',
        sessionTiles: []
      })
    ).toEqual({ connectionId: 'connection-a', profile: 'profile-a', route: undefined })
  })
})
