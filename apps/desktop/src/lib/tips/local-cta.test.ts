// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/** The local campaign tips' reshow clock. */

import { describe, expect, it } from 'vitest'

import { LOCAL_TIP_RESHOW_MS, localTipDue } from '@/lib/tips/local-cta'

describe('localTipDue', () => {
  it('is due when never shown', () => {
    expect(localTipDue(Date.now(), undefined)).toBe(true)
  })

  it('holds for a week after an ignored showing, then returns', () => {
    const now = Date.now()

    expect(localTipDue(now, now - LOCAL_TIP_RESHOW_MS + 1000)).toBe(false)
    expect(localTipDue(now, now - LOCAL_TIP_RESHOW_MS)).toBe(true)
  })
})
