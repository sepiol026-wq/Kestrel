// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { expect, it } from 'vitest'

import { rosterSourceStatus } from './roster-source-status'

it('does not report stale cached profiles as a reachable or signed-in gateway', () => {
  expect(rosterSourceStatus({ profiles: ['default'], error: 'OAuth expired', needsSignIn: true })).toEqual({
    reachable: false,
    error: 'OAuth expired',
    needsSignIn: true
  })
  expect(rosterSourceStatus({ profiles: ['default'], error: 'timed out' }).reachable).toBe(false)
  expect(rosterSourceStatus({ profiles: ['default'] }).reachable).toBe(true)
})
