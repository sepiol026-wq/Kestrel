// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { atom } from 'nanostores'

import type { ComposerTarget } from './focus'

export interface FloatingComposerOwner {
  id: string
  groupId: string
  target: ComposerTarget
}

/** User intent, not whichever editor happened to receive a delayed DOM focus. */
export const $floatingComposerOwner = atom<FloatingComposerOwner | null>(null)
