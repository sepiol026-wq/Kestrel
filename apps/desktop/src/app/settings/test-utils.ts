// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { EnvVarInfo } from '@/types/hermes'

/** An unset secret in `category`. The Keys tab and the settings search both
 *  bucket by category and branch on `is_set`, so those are what tests vary. */
export function envVar(category: string, patch: Partial<EnvVarInfo> = {}): EnvVarInfo {
  return {
    advanced: false,
    category,
    description: '',
    is_password: true,
    is_set: false,
    redacted_value: null,
    tools: [],
    url: '',
    ...patch
  }
}
