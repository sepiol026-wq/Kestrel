// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { MutableRefObject } from 'react'

import type { SessionInfo } from '@/hermes'
import { isSessionRemovalPending } from '@/store/session-removal'

import type { ClientSessionState } from '../../../types'

import { cachedSessionRow } from './utils'

/** Navigation revokes the view, not a read owned by an unchanged session. */
export function captureDisplayHydration({
  flights,
  key,
  runtimeIdByStoredSessionIdRef,
  sessionStateByRuntimeIdRef,
  stored,
  storedSessionId
}: {
  flights: Map<string, symbol>
  key: string
  runtimeIdByStoredSessionIdRef: MutableRefObject<Map<string, string>>
  sessionStateByRuntimeIdRef: MutableRefObject<Map<string, ClientSessionState>>
  stored: SessionInfo | undefined
  storedSessionId: string
}) {
  const token = Symbol(key)
  flights.set(key, token)
  const states = sessionStateByRuntimeIdRef.current
  const runtimeId = runtimeIdByStoredSessionIdRef.current.get(storedSessionId)
  const epoch = runtimeId ? (states.get(runtimeId)?.transcriptAuthorityEpoch ?? 0) : 0

  // Capture values, not the mutable list row.
  const identity = stored && {
    id: stored.id,
    lineageRootId: stored._lineage_root_id,
    connectionId: stored.connection_id,
    profile: stored.profile
  }

  return {
    owns() {
      const state = runtimeId ? states.get(runtimeId) : undefined
      const row = cachedSessionRow(storedSessionId)

      return (
        flights.get(key) === token &&
        sessionStateByRuntimeIdRef.current === states &&
        runtimeIdByStoredSessionIdRef.current.get(storedSessionId) === runtimeId &&
        (!runtimeId ||
          (state?.storedSessionId === storedSessionId && (state.transcriptAuthorityEpoch ?? 0) === epoch)) &&
        !isSessionRemovalPending(storedSessionId) &&
        (!identity ||
          Boolean(
            row &&
            row.id === identity.id &&
            row._lineage_root_id === identity.lineageRootId &&
            row.connection_id === identity.connectionId &&
            row.profile === identity.profile
          ))
      )
    },
    release() {
      if (flights.get(key) === token) {
        flights.delete(key)
      }
    }
  }
}
