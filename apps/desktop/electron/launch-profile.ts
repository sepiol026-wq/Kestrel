// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { DESKTOP_PROFILE_NAME_RE } from './desktop-profile'

/**
 * Profile from `--profile <name>` or `--profile=<name>`.
 *
 * Missing, empty, and invalid values are null so a launch without a usable
 * flag leaves the stored desktop profile alone. Names are trimmed and
 * lowercased to match the CLI's `-p` / `--profile` normalization.
 */
export function parseLaunchProfile(argv: readonly string[]): string | null {
  if (!Array.isArray(argv)) {
    return null
  }

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]

    if (typeof arg !== 'string') {
      continue
    }

    if (arg === '--profile') {
      return normalizeLaunchProfile(argv[index + 1])
    }

    if (arg.startsWith('--profile=')) {
      return normalizeLaunchProfile(arg.slice('--profile='.length))
    }
  }

  return null
}

function normalizeLaunchProfile(raw: unknown): string | null {
  if (typeof raw !== 'string') {
    return null
  }

  const name = raw.trim().toLowerCase()

  return name && DESKTOP_PROFILE_NAME_RE.test(name) ? name : null
}

/**
 * Persist a launch-time profile before startHermes reads active-profile.json.
 * A missing or invalid flag does not call persist.
 */
export function applyLaunchProfileOverride(argv: readonly string[], persist: (name: string) => void): string | null {
  const name = parseLaunchProfile(argv)

  if (!name) {
    return null
  }

  persist(name)

  return name
}
