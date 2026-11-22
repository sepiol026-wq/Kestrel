// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

export function rosterSourceStatus(source: { profiles: string[] | null; error?: string; needsSignIn?: boolean }) {
  return {
    reachable: source.profiles !== null && (!source.error || source.error === 'connect-on-demand'),
    ...(source.error ? { error: source.error } : {}),
    ...(source.needsSignIn ? { needsSignIn: true } : {})
  }
}
