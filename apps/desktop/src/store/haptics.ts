// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { atom } from 'nanostores'

import { persistStore } from '@/lib/persist-store'
import { persistBoolean, storedBoolean } from '@/lib/storage'

const HAPTICS_MUTED_STORAGE_KEY = 'hermes.desktop.hapticsMuted'

export const $hapticsMuted = atom(storedBoolean(HAPTICS_MUTED_STORAGE_KEY, false))

persistStore($hapticsMuted, (muted, options) => persistBoolean(HAPTICS_MUTED_STORAGE_KEY, muted, options), false)

// Keep automatic cues quiet in every open window, not just the settings window.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', event => {
    if (event.key === HAPTICS_MUTED_STORAGE_KEY) {
      $hapticsMuted.set(storedBoolean(HAPTICS_MUTED_STORAGE_KEY, false))
    }
  })
}

export function setHapticsMuted(muted: boolean) {
  $hapticsMuted.set(muted)
}

export function toggleHapticsMuted() {
  $hapticsMuted.set(!$hapticsMuted.get())
}
