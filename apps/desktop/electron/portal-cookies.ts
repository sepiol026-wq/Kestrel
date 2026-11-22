// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

export interface PortalCookie {
  name: string
  value: string
}

// NAS accepts either credential during migration. Provider-routing hints and
// WorkOS logout identifiers are not credentials; gateway cookies are unrelated.
const ACCESS_COOKIES = ['nas-session', '__Host-privy-token', '__Secure-privy-token', 'privy-token']
const REFRESH_COOKIES = ['nas-refresh', 'privy-session', 'privy-refresh-token']

export function portalAccessCookies(cookies: PortalCookie[]): PortalCookie[] {
  return cookies.filter(cookie => cookie?.value && ACCESS_COOKIES.includes(cookie.name))
}

export function cookiesHavePortalAccessToken(cookies: unknown): boolean {
  return Array.isArray(cookies) && portalAccessCookies(cookies).length > 0
}

export function cookiesHavePortalSession(cookies: unknown): boolean {
  return (
    cookiesHavePortalAccessToken(cookies) ||
    (Array.isArray(cookies) && cookies.some(cookie => cookie?.value && REFRESH_COOKIES.includes(cookie.name)))
  )
}
