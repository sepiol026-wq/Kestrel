// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { atom, computed } from 'nanostores'

// The tool whose arguments the model is streaming right now, and when it
// started. Generating a large payload (a 45 KB write_file) takes seconds during
// which the tool has not begun and the transcript has nothing to say.
// Per-session because a transcript may be a tile, and a tile must never narrate
// the primary chat's work.
const keyFor = (sessionId: string | null | undefined): string => sessionId ?? ''

export interface DraftingTool {
  name: string
  since: number
}

export const $draftingToolSessions = atom<Record<string, DraftingTool>>({})

/** What `sessionId` is drafting, if anything. */
export function sessionDraftingTool(sessionId: null | string) {
  return computed($draftingToolSessions, sessions => sessions[keyFor(sessionId)] ?? null)
}

export function setSessionDraftingTool(sessionId: string | null | undefined, name: string): void {
  const key = keyFor(sessionId)
  const sessions = $draftingToolSessions.get()

  if (!name) {
    if (!(key in sessions)) {
      return
    }

    const next = { ...sessions }
    delete next[key]
    $draftingToolSessions.set(next)

    return
  }

  // Re-announcing the same tool keeps the original timestamp, so the elapsed
  // count reads as one continuous wait rather than restarting.
  if (sessions[key]?.name === name) {
    return
  }

  $draftingToolSessions.set({ ...sessions, [key]: { name, since: Date.now() } })
}
