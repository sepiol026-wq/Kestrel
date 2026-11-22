// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Ownership helpers for the main-process descriptor cache (`backendPool` in
 * main.ts): keyed promises for gateway connection descriptors, never process
 * handles. A dial yields at the `gateway ensure` / update-clearance awaits, so
 * a profile delete, a retirement, or a faster sibling dial can replace or
 * forget the entry underneath it. Both helpers compare by identity so the
 * loser of that race can neither evict the winner nor resurrect itself.
 */

export interface BackendDescriptorEntry {
  connectionPromise: Promise<unknown> | null
}

/** Drop a failed entry — only if it is still the installed one. */
export function forgetFailedDescriptor<TEntry extends BackendDescriptorEntry>(
  cache: Map<string, TEntry>,
  key: string,
  entry: TEntry
): void {
  if (cache.get(key) === entry) {
    cache.delete(key)
  }
}

/** Refuse to complete a dial whose entry is no longer the installed one. */
export function assertDescriptorStillOwned<TEntry extends BackendDescriptorEntry>(
  cache: Map<string, TEntry>,
  key: string,
  entry: TEntry
): void {
  if (cache.get(key) !== entry) {
    throw new Error(`Profile backend start for "${key}" was cancelled before spawn.`)
  }
}
