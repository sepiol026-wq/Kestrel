// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Whether an `/api/status` answer is the trimmed body the gateway's Webapp gives a caller it does
 * not count as signed in. `/api/status` is public, so the gate never refreshes on it: a signed-in
 * tab whose access token expired since its last gated request also gets this body, until its next
 * gated request rotates the cookies. The body says nothing about the gateway's profiles or the
 * install, so a reader keeps the answer it already has instead of reading the missing fields as
 * an older backend. The full body always carries `active_sessions`, and on a gated bind
 * `auth_required` is true.
 */
export function isSignedOutStatus(status: unknown): boolean {
  if (!status || typeof status !== 'object') {
    return false
  }

  const body = status as Record<string, unknown>

  return body.auth_required === true && !('active_sessions' in body) && !('install_id' in body)
}
