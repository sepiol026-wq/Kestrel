// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { isExpectedOauthNavigationAbort } from './oauth-navigation'

describe('isExpectedOauthNavigationAbort', () => {
  it('treats Electron ERR_ABORTED callback navigation as non-fatal', () => {
    const error = Object.assign(
      new Error("ERR_ABORTED (-3) loading 'https://agent.example.com/auth/callback?code=redacted'"),
      {
        code: -3
      }
    )

    expect(isExpectedOauthNavigationAbort(error)).toBe(true)
  })

  it('does not suppress genuine gateway load failures', () => {
    expect(isExpectedOauthNavigationAbort(new Error('ERR_NAME_NOT_RESOLVED (-105)'))).toBe(false)
    expect(isExpectedOauthNavigationAbort(new Error('HTTP 502 from gateway'))).toBe(false)
  })
})
