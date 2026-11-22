// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

export function isExpectedOauthNavigationAbort(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false
  }

  const code = 'code' in error ? Number((error as { code?: unknown }).code) : Number.NaN
  const message = error instanceof Error ? error.message : String(error)

  return code === -3 || /\bERR_ABORTED\b|\(-3\)/.test(message)
}
