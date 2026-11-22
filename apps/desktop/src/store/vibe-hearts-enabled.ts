// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Floating vibe hearts (affection burst on ily / <3 / good bot / thanks).
 *
 * On by default: that is today's always-on behavior. Settings → Appearance owns
 * the lever so hearts stay presentation-scoped (desktop AGENTS.md: state lives
 * with its authority). Distinct from Message Reactions, which are iMessage-style
 * tapbacks on message rows.
 */

import { atom } from 'nanostores'

import { persistString, storedString } from '@/lib/storage'

import { recordFeatureToggle } from './desktop-metrics'

const KEY = 'hermes.desktop.vibeHearts.v1'

// Absent key and anything other than "off" keep hearts on, matching the
// pre-toggle always-on default for existing installs.
export const $vibeHeartsEnabled = atom<boolean>(typeof window === 'undefined' ? true : storedString(KEY) !== 'off')

export function setVibeHeartsEnabled(enabled: boolean): void {
  recordFeatureToggle('vibe_hearts', $vibeHeartsEnabled.get(), enabled)
  $vibeHeartsEnabled.set(enabled)
}

if (typeof window !== 'undefined') {
  $vibeHeartsEnabled.listen(enabled => {
    persistString(KEY, enabled ? 'on' : 'off')
  })
}
