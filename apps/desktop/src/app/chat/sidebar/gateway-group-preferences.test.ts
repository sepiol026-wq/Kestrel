// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// @vitest-environment jsdom
import { expect, it, vi } from 'vitest'

import {
  $gatewayGroupAliases,
  $gatewayGroupCollapsed,
  $gatewayGroupOrder,
  renameGatewayGroup,
  reorderGatewayGroups,
  toggleGatewayGroup
} from './gateway-group-preferences'

it('persists identity-scoped edits and reorders newly discovered groups without forgetting hidden groups', async () => {
  const local = JSON.stringify(['local', 'default'])
  const remote = JSON.stringify(['remote-1', 'default'])
  const cloud = JSON.stringify(['cloud-1', 'default'])
  $gatewayGroupOrder.set([])
  reorderGatewayGroups([remote, local])
  expect($gatewayGroupOrder.get()).toEqual([remote, local])
  renameGatewayGroup(remote, ' Research lab ')
  toggleGatewayGroup(remote)
  reorderGatewayGroups([cloud, local])
  expect($gatewayGroupOrder.get()).toEqual([remote, cloud, local])
  expect($gatewayGroupAliases.get()).toEqual({ [remote]: 'Research lab' })
  expect($gatewayGroupCollapsed.get()).toEqual([remote])
  vi.resetModules()
  const restored = await import('./gateway-group-preferences')
  expect(restored.$gatewayGroupOrder.get()).toEqual([remote, cloud, local])
  expect(restored.$gatewayGroupAliases.get()).toEqual({ [remote]: 'Research lab' })
  expect(restored.$gatewayGroupCollapsed.get()).toEqual([remote])
  restored.renameGatewayGroup(remote, '  ')
  expect(restored.$gatewayGroupAliases.get()).toEqual({})
})
