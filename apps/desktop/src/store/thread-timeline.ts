// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { atom } from 'nanostores'

import { persistStore } from '@/lib/persist-store'
import { persistBoolean, storedBoolean } from '@/lib/storage'

import { recordFeatureToggle } from './desktop-metrics'

const HIDE_THREAD_TIMELINE_STORAGE_KEY = 'hermes.desktop.hideThreadTimeline'

/** Desktop-local appearance preference, shared by all threads in this window. */
export const $hideThreadTimeline = atom(storedBoolean(HIDE_THREAD_TIMELINE_STORAGE_KEY, false))

persistStore(
  $hideThreadTimeline,
  (value, options) => persistBoolean(HIDE_THREAD_TIMELINE_STORAGE_KEY, value, options),
  false
)

export function setHideThreadTimeline(value: boolean) {
  recordFeatureToggle('thread_timeline', !$hideThreadTimeline.get(), !value)
  $hideThreadTimeline.set(value)
}
