// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { computed } from 'nanostores'

import { $subagentsBySession, activeSubagentCount } from './subagents'

export interface BackgroundResume {
  /** Running/queued background children belonging to this runtime session. */
  count: number
}

/** Background work outlives its spawning turn. The owning view gates this
 * signal on its own busy state; global focus and raw stream text are unrelated. */
export function sessionBackgroundResume(sessionId: null | string) {
  const $count = computed($subagentsBySession, bySession =>
    sessionId ? activeSubagentCount(bySession[sessionId] ?? []) : 0
  )

  // Stream frames must not repaint a count-only notice.
  return computed($count, (count): BackgroundResume | null => (count ? { count } : null))
}
