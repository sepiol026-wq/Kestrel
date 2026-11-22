// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { atom } from 'nanostores'

/** Bumped whenever something that changes `GET /api/memory`'s answer lands
 *  (config autosave, provider credential save, OAuth completion), so the
 *  Memory summary refetches instead of showing the pre-change readiness. */
export const $memoryStatusRevision = atom(0)

export function refreshMemoryStatus(): void {
  $memoryStatusRevision.set($memoryStatusRevision.get() + 1)
}
