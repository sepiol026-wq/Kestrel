// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { readJsonErrorBody, readStatusCode } from './api-transport'

// The NAS (status, error code) pairs that mean the remembered team itself is
// gone for this user, as opposed to the credential or the request being bad.
const STALE_TEAM_RESPONSES: Record<number, string> = { 403: 'org_access_denied', 404: 'org_not_found' }

// A remembered team is a discovery preference, not an authorization grant.
// If NAS says it no longer exists or is inaccessible, let NAS resolve current
// memberships (including its 409 team picker). Never retry generic denials.
export async function discoverWithTeamFallback<T>(fetchAgents: (org?: string) => Promise<T>, org?: string): Promise<T> {
  try {
    return await fetchAgents(org)
  } catch (error) {
    const staleTeamCode = STALE_TEAM_RESPONSES[readStatusCode(error)]

    if (org && staleTeamCode && readJsonErrorBody(error)?.error === staleTeamCode) {
      return fetchAgents()
    }

    throw error
  }
}
