// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { expect, it } from 'vitest'

import { activatedTurnAdmission } from './resume-barrier-reread'

const running = { admission_id: 'adm-2', input_id: 'in-2', status: 'started' }
// A queued row handed to the running execution reads `started` too, until that execution settles it.
const steering = { admission_id: 'adm-3', input_id: 'in-3', status: 'started', steering: true }
const queued = { admission_id: 'adm-4', input_id: 'in-4', status: 'queued' }

it("names the activation snapshot's running execution, not the turn the tab last streamed", () => {
  const finished = { turnAdmissionId: 'adm-1' }

  expect(activatedTurnAdmission(finished, finished, [steering, running, queued])).toBe('adm-2')
  expect(activatedTurnAdmission(finished, finished, [queued])).toBeNull()
  expect(activatedTurnAdmission(finished, finished, undefined)).toBeNull()
})

it('keeps the execution a crash lost while the owner still lists it', () => {
  const lost = { turnAdmissionId: 'adm-1' }

  expect(activatedTurnAdmission(lost, lost, [{ admission_id: 'adm-1', input_id: 'in-1', status: 'unknown' }])).toBe(
    'adm-1'
  )
})

it('keeps the execution a frame named while the activation was in flight', () => {
  expect(activatedTurnAdmission({ turnAdmissionId: 'adm-5' }, { turnAdmissionId: 'adm-1' }, [running])).toBe('adm-5')
})
