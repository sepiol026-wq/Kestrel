// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import {
  activeGatewayConnectionId,
  activeGatewayProfileKey,
  requestGatewayForAgent,
  requestGatewayForProfile
} from '@/store/gateway'

function profileKey(profile: string): string {
  return profile.trim() || 'default'
}

/**
 * Send a gateway RPC to the route the window is on: `profile` on the ACTIVE
 * gateway when it names the active route's profile.
 *
 * A bare profile name has no gateway. `requestGatewayForProfile` resolves it
 * through this machine's profile pool, so a name served only by a remote or
 * SSH gateway (`marina` on Homelab) made main try to start a local backend for
 * a profile this machine does not have ("Profile \"marina\" no longer exists").
 * A profile other than the active route's keeps the profile-only route.
 */
export async function requestGatewayForActiveRoute<T>(
  profile: string,
  method: string,
  params: Record<string, unknown> = {},
  timeoutMs?: number
): Promise<T> {
  const key = profileKey(profile)

  if (key !== profileKey(activeGatewayProfileKey())) {
    return timeoutMs === undefined
      ? requestGatewayForProfile<T>(key, method, params)
      : requestGatewayForProfile<T>(key, method, params, timeoutMs)
  }

  return timeoutMs === undefined
    ? requestGatewayForAgent<T>(activeGatewayConnectionId(), key, method, params)
    : requestGatewayForAgent<T>(activeGatewayConnectionId(), key, method, params, timeoutMs)
}
