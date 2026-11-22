// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Pairing writes must target the profile the user is actually looking at.
// The approve/revoke endpoints read `profile` off the BODY (a POST body is
// not touched by query-param scoping), so a request that only carried
// `profileScoped()` at the top level would approve into the default
// profile's whitelist while the operator was managing another one — a grant
// the running gateway for that profile never consults.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const api = vi.fn().mockResolvedValue({ ok: true })

describe('pairing requests carry the active profile', () => {
  beforeEach(() => {
    api.mockClear()
    Object.defineProperty(window, 'hermesDesktop', { configurable: true, value: { api } })
  })

  afterEach(() => {
    Reflect.deleteProperty(window, 'hermesDesktop')
  })

  it('scopes approve and revoke by body, and the listing by query', async () => {
    const mod = await import('@/hermes')
    mod.setApiRequestProfile('work')

    await mod.approvePairing('telegram', 'a'.repeat(16))
    await mod.revokePairing('telegram', 'U1')
    await mod.getPairing()

    const [approve, revoke, list] = api.mock.calls.map(call => call[0])

    expect(approve.body.profile).toBe('work')
    expect(revoke.body.profile).toBe('work')
    expect(list.profile).toBe('work')
  })

  it('omits the profile entirely for single-profile users', async () => {
    const mod = await import('@/hermes')
    mod.setApiRequestProfile(null)

    await mod.approvePairing('telegram', 'a'.repeat(16))
    await mod.getPairing()

    const [approve, list] = api.mock.calls.map(call => call[0])

    expect(approve.body.profile).toBeUndefined()
    expect(list.profile).toBeUndefined()
  })
})
