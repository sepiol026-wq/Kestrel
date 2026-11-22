// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { SkillInfo } from '@/types/hermes'

/**
 * #108032: an external mount is not a managed hub/bundled source — it is the user's
 * own directory pointed at via skills.external_dirs. Origin only, never mutability:
 * external skills stay editable in place (a refusal would just breed silent local
 * duplicates — commit 8c8fc6c1ec / PR #17512).
 */

export function catalogSourceFor(provenance: SkillInfo['provenance']): 'built-in' | 'hub' | 'external' | 'local' {
  if (provenance === 'bundled') {
    return 'built-in'
  }

  if (provenance === 'hub') {
    return 'hub'
  }

  if (provenance === 'external') {
    return 'external'
  }

  return 'local'
}

export function isEditableProvenance(provenance: SkillInfo['provenance']): boolean {
  // Only learned/local skills are the user's to rewrite or archive — bundled and
  // hub skills are managed by their sources. External mounts stay editable in
  // place (the user pointed skills.external_dirs at them).
  return provenance === 'agent' || provenance === 'external'
}
