// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { expect, test } from 'vitest'

import { createStaleGatewayRestarter } from './local-gateway'

// dokterdok N71: two owners (the multiplexer and a standalone profile with multiplex off) on the
// same stale code are two processes; the second must be restarted too, not attached as-is.
test('a second owner on the same stale code is restarted, while a served sibling shares its multiplexer restart', async () => {
  const restarted: string[] = []
  const restart = createStaleGatewayRestarter(async owner => { restarted.push(owner) }, () => undefined)
  const stale = { gateway: 'old', client: 'new' }

  const owner = (profile_id: string, control_home: null | string = null) =>
    ({ profile_id, control_home, instance_id: 'i', authority_epoch: 1, runtime_protocol: 1, api_origin: 'http://127.0.0.1:1', capabilities: [], supervisor: 'none' })

  expect(await restart(owner('/h'), stale)).not.toBeNull()
  expect(await restart(owner('/h/profiles/work'), stale)).not.toBeNull()
  // A served secondary lives in the multiplexer already restarted above: no second restart.
  expect(await restart(owner('/h/profiles/ops', '/h'), stale)).toBeNull()
  expect(restarted).toEqual(['default', 'work'])
})
