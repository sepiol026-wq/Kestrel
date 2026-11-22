// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { host } from '@hermes/plugin-sdk'

/** Hold `route`'s pooled gateway socket open until the returned release runs, so the events that follow a
 *  request (pushes, display leases, a turn's stream) keep arriving. The SDK disposes an inactive socket once its
 *  request count hits zero. Null when there is no lease: an older host without retainProfile, or a lease that
 *  failed. Never throws. */
export async function retainRouteSocket(
  route: Parameters<typeof host.retainProfile>[0],
  options?: Parameters<typeof host.retainProfile>[1]
): Promise<(() => void) | null> {
  if (typeof host.retainProfile !== 'function') {return null}

  try {
    const release = await (options ? host.retainProfile(route, options) : host.retainProfile(route))

    return typeof release === 'function' ? release : null
  } catch {
    return null
  }
}
