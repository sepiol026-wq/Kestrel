// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { type PetInfo } from '@/store/pet'

// Sprite row → the PetInfo frame-count key it resolves to (directional walks and
// aliases collapse onto their base state).
const ROW_TO_FRAME_KEY: Record<string, string> = {
  idle: 'idle',
  wave: 'wave',
  waving: 'wave',
  jump: 'jump',
  jumping: 'jump',
  run: 'run',
  running: 'run',
  'running-right': 'run',
  'running-left': 'run',
  failed: 'failed',
  review: 'review',
  waiting: 'waiting'
}

// Real frame count for a row, preferring the concrete per-row count, then the
// per-state count, then the mapped base state, then the sheet-wide default.
export function frameCountForRow(pet: PetInfo, row: string): number {
  const mapped = ROW_TO_FRAME_KEY[row]

  return (
    pet.framesByRow?.[row] ??
    pet.framesByState?.[row] ??
    (mapped ? pet.framesByState?.[mapped] : undefined) ??
    pet.framesPerState ??
    0
  )
}
