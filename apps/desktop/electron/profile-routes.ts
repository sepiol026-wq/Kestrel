// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/** `/api/profiles/<suffix>` collection routes, by method (hermes_cli/web_routers/profiles.py). Any
 *  other method on these paths is the per-profile `/api/profiles/{name}` route of a profile NAMED
 *  `active`, `import`, `sessions`, …, which are valid profile names. Mirror of the gateway's
 *  hermes_cli/dashboard_auth/native_http.py `PROFILE_COLLECTION_ROUTES`: grant selection, ticket
 *  routing and ambient profile scoping all read this one table. */
const PROFILE_COLLECTION_ROUTES: Readonly<Record<string, readonly string[]>> = {
  active: ['GET', 'POST'],
  import: ['POST'],
  'projects/tree': ['GET'],
  sessions: ['GET'],
  'sessions/pull-requests': ['POST'],
  'sessions/sidebar': ['GET']
}

/** The `/api/profiles/` suffix of *pathname* (trailing slashes dropped), or '' for any other path. */
export function profileRouteSuffix(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '')

  return trimmed.startsWith('/api/profiles/') ? trimmed.slice('/api/profiles/'.length) : ''
}

/** The collection `method pathname` serves, or null when the path names a profile (or is not a
 *  `/api/profiles/` path at all). With no *method* (a caller that only has the path), every listed
 *  suffix reads as its collection, as before. */
export function profileCollectionRoute(pathname: string, method?: string): null | string {
  const suffix = profileRouteSuffix(pathname)

  if (!suffix || !Object.hasOwn(PROFILE_COLLECTION_ROUTES, suffix)) {return null}

  return method === undefined || PROFILE_COLLECTION_ROUTES[suffix].includes(method.toUpperCase()) ? suffix : null
}
