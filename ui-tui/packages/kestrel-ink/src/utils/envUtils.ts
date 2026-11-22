// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

export function isEnvTruthy(envVar: string | boolean | undefined): boolean {
  if (!envVar) {
    return false
  }

  if (typeof envVar === 'boolean') {
    return envVar
  }

  const v = envVar.toLowerCase().trim()

  return ['1', 'true', 'yes', 'on'].includes(v)
}
