// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { RefObject } from 'react'

import type { SpeechStreamSession } from '@/lib/voice-playback'

export interface PendingVoiceResponse {
  id: string
  pending: boolean
  text: string
}

/** Push any new reply text into the live session; finish when complete. */
export function feedVoiceConversationSpeech(
  speechSession: RefObject<SpeechStreamSession | null>,
  activeResponseId: RefObject<string | null>,
  responseId: string,
  pendingResponse: () => PendingVoiceResponse | null,
  spokenSourceLength: RefObject<number>,
  busy: RefObject<boolean>
) {
  const session = speechSession.current

  if (!session || activeResponseId.current !== responseId) {
    return
  }

  const response = pendingResponse()

  if (response && response.id === responseId) {
    if (response.text.length > spokenSourceLength.current) {
      session.append(response.text.slice(spokenSourceLength.current))
      spokenSourceLength.current = response.text.length
    }

    if (!response.pending) {
      // A sealed interim is a committed boundary even while its tool runs.
      // Keep the session open for the next bubble, but speak this tail now.
      if (busy.current) {
        session.flush?.()
      } else {
        session.finish()
      }
    }
  } else if (!busy.current) {
    // Reply consumed/vanished while we were speaking — close out the turn.
    session.finish()
  }
}
