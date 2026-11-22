// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { WriteOptions } from '@/lib/storage'

/** Persist a store: the value it loads with (its default, or a heal of what
 *  was stored) as provisional, every later change as the user's. A load value
 *  equal to `fallback` (the store's default) is provisional even when it is
 *  already stored: older builds persisted every default at load, unmarked, and
 *  a default carries no choice the machine's shared store should take over
 *  another client's real one (#145536 re-review). */
export function persistStore<T>(
  store: { subscribe(listener: (value: T) => void): () => void },
  persist: (value: T, options: WriteOptions) => void,
  fallback: T
): () => void {
  let loading = true
  const fallbackJson = JSON.stringify(fallback)

  const stop = store.subscribe(value =>
    persist(value, loading ? { isDefault: JSON.stringify(value) === fallbackJson, provisional: true } : {})
  )

  loading = false

  return stop
}
