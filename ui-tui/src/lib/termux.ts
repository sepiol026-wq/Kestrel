// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

const TERMUX_PREFIX = '/data/data/com.termux/files/usr'

const truthy = (value?: string): boolean => /^(?:1|true|yes|on)$/i.test(String(value ?? '').trim())

export const isTermuxEnv = (env: NodeJS.ProcessEnv = process.env): boolean => {
  const prefix = String(env.PREFIX ?? '')

  return Boolean(env.TERMUX_VERSION) || prefix.includes(TERMUX_PREFIX)
}

/**
 * Return true when Hermes should enable Termux-focused TUI defaults.
 *
 * Defaults to on in Termux, with an explicit opt-out for debugging:
 *   HERMES_TUI_TERMUX_MODE=0
 */
export const isTermuxTuiMode = (env: NodeJS.ProcessEnv = process.env): boolean => {
  if (!isTermuxEnv(env)) {
    return false
  }

  const override = String(env.HERMES_TUI_TERMUX_MODE ?? '')
    .trim()
    .toLowerCase()

  if (override) {
    return truthy(override)
  }

  return true
}
