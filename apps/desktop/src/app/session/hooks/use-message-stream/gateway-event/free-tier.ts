// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { runFreeTierChallenge } from '@/store/free-tier-challenge'
import { activeGatewayConnectionId, requestGatewayForAgent } from '@/store/gateway'

import type { GatewayEventContext } from './types'

/**
 * free_tier.challenge: the account service wants a browser challenge cleared
 * before it mints the free-tier token. The backend polls for the result on its
 * own; this only gets the page loaded (hidden). Any source's challenge is worth
 * running: it is the install's identity, not the focused session's.
 */
export function handleFreeTierEvent({ deps, event, payload }: GatewayEventContext): boolean {
  if (event.type !== 'free_tier.challenge') {
    return false
  }

  const connectionId = event.connectionId ?? activeGatewayConnectionId()
  const profile = event.profile ?? deps.activeGatewayProfile

  void runFreeTierChallenge(payload, (method, params) => requestGatewayForAgent(connectionId, profile, method, params))

  return true
}
