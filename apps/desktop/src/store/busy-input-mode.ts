// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { atom } from 'nanostores'

export type BusyInputMode = 'interrupt' | 'queue' | 'steer'

export function normalizeBusyInputMode(value: unknown): BusyInputMode {
  const mode = typeof value === 'string' ? value.trim().toLowerCase() : ''

  return mode === 'steer' || mode === 'queue' ? mode : 'interrupt'
}

export function busyInputOwnerKey(connectionId?: string | null, profile?: string | null): string {
  return JSON.stringify([connectionId ?? '', profile?.trim() || 'default'])
}

// A backend config snapshot, never a persisted Desktop-only preference.
export const $busyInputConfig = atom<{ owner: string; connection: unknown; mode: BusyInputMode } | null>(null)
