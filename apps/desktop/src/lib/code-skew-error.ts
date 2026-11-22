// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/** True when a backend error is the post-update stale-module 503 (#97046). */
export function isCodeSkewRestartRequired(error: unknown): boolean {
  return /Restart required:/i.test(errorText(error))
}

function errorText(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return typeof error === 'string' ? error : String(error ?? '')
}
