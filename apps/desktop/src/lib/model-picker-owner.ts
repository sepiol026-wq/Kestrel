// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { SessionOwnerRoute } from '@/store/session-request-router'

interface ModelPickerOwnerInput {
  ambientConnectionId?: string
  ambientProfile: string
  focusedStoredSessionId: null | string
  selectedStoredSessionId: null | string
  sessionTiles: readonly {
    ownerRoute?: SessionOwnerRoute
    storedSessionId: string
  }[]
}

export interface ModelPickerOwner {
  connectionId?: string
  profile: string
  route?: SessionOwnerRoute
}

/** Resolve one coherent owner for every picker operation. A tile route wins
 * only when the tile, rather than the primary session, owns keyboard focus. */
export function resolveModelPickerOwner({
  ambientConnectionId,
  ambientProfile,
  focusedStoredSessionId,
  selectedStoredSessionId,
  sessionTiles
}: ModelPickerOwnerInput): ModelPickerOwner {
  const route =
    focusedStoredSessionId && focusedStoredSessionId !== selectedStoredSessionId
      ? sessionTiles.find(tile => tile.storedSessionId === focusedStoredSessionId)?.ownerRoute
      : undefined

  return {
    connectionId: route?.connectionId || ambientConnectionId,
    profile: route?.targetProfile || route?.profile || ambientProfile,
    route
  }
}
