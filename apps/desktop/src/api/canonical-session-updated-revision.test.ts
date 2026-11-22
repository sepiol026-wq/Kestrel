// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { expect, test } from 'vitest'

import { CanonicalDesktopProtocol } from './canonical-protocol'

// N91: viewer B learns the CAS revision viewer A's rename committed from the session.updated
// receipt fanout, and a replayed older receipt never rewinds it.
test('a second viewer adopts the revision from session.updated, monotonically', () => {
  const a = new CanonicalDesktopProtocol()
  const b = new CanonicalDesktopProtocol()

  for (const v of [a, b]) { v.result('session.resume', { session_id: 's' }, { session_id: 's', revision: 7, execution_generation: 3 }) }
  const receipt = { session_id: 's', revision: 8, title: 'A' }
  a.result('session.title', a.prepare('session.title', { session_id: 's', title: 'A' }), receipt)
  b.event({ type: 'session.updated', session_id: 's', payload: receipt })
  expect(b.prepare('session.branch', { session_id: 's' }).expected_revision).toBe(8)
  b.event({ type: 'session.updated', session_id: 's', payload: { session_id: 's', revision: 6 } })
  expect(b.prepare('session.compress', { session_id: 's' }).expected_revision).toBe(8)
  b.event({ type: 'session.updated', session_id: 's', payload: { session_id: 'other', revision: 20 } })
  expect(b.prepare('session.archive', { session_id: 's', archived: true }).expected_revision).toBe(8)
})
