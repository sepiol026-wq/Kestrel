// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Profile ids that cross into backend/TUI spawn argv must be non-empty
// PROFILE_ID_RE slugs. Anything else (a numeric roster/DB id, an empty string,
// a display label with spaces) must never reach `--profile <value>`: the CLI's
// normalize_profile_name used to str()-coerce non-strings, bootstrapping a
// phantom `profiles/0/` directory with state.db and SOUL.md but no config.yaml
// (#88842). This module mirrors the CLI's normalize semantics (trim +
// case-fold + slug test) without pulling desktop-profile's fs/path imports
// into the pure spawn-arg builders that need it.

export const PROFILE_ID_ARG_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/

/**
 * A profile value safe to pin via `--profile <name>`, normalized the way the
 * CLI would normalize it; `null` when the value must not cross into argv.
 */
export function backendProfileArg(profile: unknown): string | null {
  if (typeof profile !== 'string') {
    return null
  }

  const name = profile.trim().toLowerCase()

  if (!name) {
    return null
  }

  // `default` is the RE-legal alias for ~/.hermes itself; every other id is a slug.
  return name === 'default' || PROFILE_ID_ARG_RE.test(name) ? name : null
}
