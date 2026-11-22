// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { normalizeProfileKey } from './profile'
import type { SessionProfileRoute } from './session-request-router'

/** A LOCAL owner route that named profile `from` (as its profile or backend target) names `to` after a rename;
 *  any other route, and one the rename does not touch, is returned as is. */
export function renameLocalOwnerRoute(
  owner: SessionProfileRoute | undefined,
  from: string,
  to: string
): SessionProfileRoute | undefined {
  if (!owner || (String(owner.connectionId ?? '').trim() || 'local') !== 'local') {
    return owner
  }

  const profile = normalizeProfileKey(owner.profile) === from ? to : owner.profile
  const targetProfile = normalizeProfileKey(owner.targetProfile) === from ? to : owner.targetProfile

  return profile === owner.profile && targetProfile === owner.targetProfile
    ? owner
    : { ...owner, profile, ...(targetProfile === undefined ? {} : { targetProfile }) }
}
