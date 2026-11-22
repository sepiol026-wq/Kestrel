// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/** Lets a mid-turn boundary (an accepted steer) paint the session's buffered stream
 *  deltas before it seals the live bubble, so text the user had already been sent
 *  never lands on the far side of the boundary. The stream hook owns the buffer. */
type DeltaFlush = (sessionId: string) => void

let activeFlush: DeltaFlush | null = null

export function registerStreamDeltaFlush(flush: DeltaFlush): () => void {
  activeFlush = flush

  return () => {
    if (activeFlush === flush) {
      activeFlush = null
    }
  }
}

export function flushStreamDeltas(sessionId: string) {
  activeFlush?.(sessionId)
}
