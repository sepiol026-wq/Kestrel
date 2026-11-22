// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

export interface GatewayGroupEngine {
  kind: 'gateway'
  connectionId: string
  profile: string
  roomId: string
}

export type GroupEngine = 'desktop' | GatewayGroupEngine

/** Gateway ownership is room identity, independent of the current membership. */
export function gatewayGroupEngine(...sources: Array<{ engine?: unknown } | null | undefined>): { engine?: GatewayGroupEngine } {
  for (const source of sources) {
    const engine = source?.engine as GatewayGroupEngine | undefined

    if (engine?.kind === 'gateway' && [engine.connectionId, engine.profile, engine.roomId].every(value => typeof value === 'string' && value.trim())) {
      return { engine }
    }
  }

  return {}
}

/** Keep the recorded execution owner when restoring or updating a room. */
export function stickyGroupEngine(...sources: Array<{ engine?: unknown } | null | undefined>): { engine?: GroupEngine } {
  const gateway = gatewayGroupEngine(...sources)

  return gateway.engine ? gateway : sources.some(source => source?.engine === 'desktop') ? { engine: 'desktop' } : {}
}

/** A name collision cannot attach another room's transcript to a gateway owner. */
export function gatewayGroupIdentityConflicts(left: { engine?: unknown; roomId?: string | null }, right: { engine?: unknown; roomId?: string | null }): boolean {
  const local = gatewayGroupEngine(left).engine
  const remote = gatewayGroupEngine(right).engine

  if ((!local && !remote) || (!local && !left.roomId)) {return false}

  return (local?.roomId ?? left.roomId) !== (remote?.roomId ?? right.roomId) ||
    Boolean(local && remote && (local.connectionId !== remote.connectionId || local.profile !== remote.profile))
}
