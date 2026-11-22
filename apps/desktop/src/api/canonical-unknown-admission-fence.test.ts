// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { expect, test } from 'vitest'

import { CanonicalDesktopProtocol } from './canonical-protocol'

// C20: a delayed generation-1 session.info replay (session.events.since) with `pending: []` must not
// delete the unknown admission a live generation-2 frame published; a current empty frame still does.
test('a stale session.info replay leaves the live Discard action usable', () => {
  const protocol = new CanonicalDesktopProtocol()
  const discard = { session_id: 's', admission_id: 'lost' }
  protocol.event({ type: 'session.info', session_id: 's', payload: { execution_generation: 2, pending: [{ admission_id: 'lost', status: 'unknown', execution_generation: 2 }] } })
  protocol.event({ type: 'session.info', session_id: 's', payload: { execution_generation: 1, pending: [] } })
  expect(protocol.prepare('prompt.resolve_unknown', discard)).toEqual({ ...discard, execution_generation: 2 })
  protocol.event({ type: 'session.info', session_id: 's', payload: { execution_generation: 2, pending: [] } })
  expect(() => protocol.prepare('prompt.resolve_unknown', discard)).toThrow('unknown')
})
