// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { atom } from 'nanostores'

import { persistBoolean, storedBoolean } from '@/lib/storage'

const KEY = 'hermes.desktop.model-pricing.v1'

/** Whether the model picker shows per-model token prices. Off by default: most rows are noise until you're comparing cost. */
export const $showModelPricing = atom(storedBoolean(KEY, false))

$showModelPricing.subscribe(on => persistBoolean(KEY, on))

export function setShowModelPricing(on: boolean) {
  $showModelPricing.set(on)
}
