// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useStoreSelector } from '@/lib/use-session-slice'
import { $sessions, sessionMatchesStoredId } from '@/store/session'

/**
 * The focused session's stored row scalars: its cold/fallback start time and
 * cwd, and the gateway it runs on (a Connections-tagged row names its gateway;
 * an untagged one is the window's primary, which decides whether the OS file
 * manager on this computer can show its workspace at all). Each is selected on
 * its own, so a session-list write (title updates, poll refreshes, archives)
 * re-renders the statusbar only when one of these answers flips.
 */
export function useFocusedSessionRow(focusedStoredSessionId: null | string) {
  const row = (sessions: ReturnType<typeof $sessions.get>) =>
    focusedStoredSessionId ? sessions.find(s => sessionMatchesStoredId(s, focusedStoredSessionId)) : undefined

  return {
    focusedRowConnectionId: useStoreSelector($sessions, sessions => row(sessions)?.connection_id?.trim() || ''),
    focusedRowCwd: useStoreSelector($sessions, sessions => row(sessions)?.cwd?.trim() || ''),
    focusedRowStartedAt: useStoreSelector($sessions, sessions => row(sessions)?.started_at ?? null)
  }
}
