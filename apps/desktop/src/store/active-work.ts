// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Mirror of "which chats are mid-turn" to the main process.
 *
 * The renderer is the only side that knows a turn is in flight, and the main
 * process is the only side that can intercept a quit. This module bridges the
 * two: it publishes a small summary on every membership change, and
 * `electron/quit-guard.ts` turns that into the confirmation dialog.
 *
 * Imported for its side effect from `main.tsx`, alongside `store/translucency`.
 */

import { computed } from 'nanostores'

import type { HermesActiveWork } from '@/global'
import { $sessions } from '@/store/session'
import { $workingSessionIds } from '@/store/session-states'
import { $voiceStreamPaintOwners } from '@/store/voice-stream-paint'

const $activeWork = computed(
  [$workingSessionIds, $sessions, $voiceStreamPaintOwners],
  (workingIds, sessions, voiceOwners): HermesActiveWork => {
    const titleById = new Map(sessions.map(session => [session.id, session.title?.trim() ?? '']))

    return {
      count: workingIds.length,
      titles: workingIds.map(id => titleById.get(id) ?? '').filter(Boolean),
      // Auto-speak waits for completed replies; only local conversations need live text.
      ...(voiceOwners > 0 ? { voiceActive: true } : {})
    }
  }
)

if (typeof window !== 'undefined') {
  // `$sessions` republishes on unrelated churn (previews, heartbeats), so only
  // send when the summary itself moved — this crosses a process boundary.
  let lastSent = ''

  $activeWork.subscribe(work => {
    const next = JSON.stringify(work)

    if (next === lastSent) {
      return
    }

    lastSent = next
    window.hermesDesktop?.setActiveWork?.(work)
  })
}
