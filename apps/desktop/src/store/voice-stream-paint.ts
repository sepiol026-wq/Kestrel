// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { atom } from 'nanostores'

// Voice replies still consume the frame-published transcript. This is streaming
// demand only: enabling voice must not disable normal idle-window throttling.
export const $voiceStreamPaintOwners = atom(0)

export function retainVoiceStreamPaint(): () => void {
  $voiceStreamPaintOwners.set($voiceStreamPaintOwners.get() + 1)

  return () => {
    $voiceStreamPaintOwners.set($voiceStreamPaintOwners.get() - 1)
  }
}
