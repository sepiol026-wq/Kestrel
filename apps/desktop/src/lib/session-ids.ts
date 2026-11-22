// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// The gateway tags every event — and therefore every native notification —
// with the *runtime* session id (the key under which the session lives in the
// gateway's in-memory `_sessions` map). The chat route, however, is keyed by
// the *stored* session id (`stored_session_id`), which is a different value:
// a brand-new chat gets a runtime id immediately but its stored id is assigned
// when the first turn persists. Navigating to a runtime id therefore tries to
// resume a stored session that does not exist ("session not found") and
// strands the user, who experiences it as the running session being destroyed.
//
// `runtimeIdByStoredSessionId` maps stored -> runtime; this resolves the
// reverse so notification-click navigation lands on the real route. The id is
// returned unchanged when no mapping is known — it may already be a stored id
// (e.g. a notification for a session this window never opened), in which case
// the normal resume/REST lookup handles it.
export function storedSessionIdForNotification(
  id: string,
  runtimeIdByStoredSessionId: ReadonlyMap<string, string>
): string {
  for (const [storedId, runtimeId] of runtimeIdByStoredSessionId) {
    if (runtimeId === id) {
      return storedId
    }
  }

  return id
}
