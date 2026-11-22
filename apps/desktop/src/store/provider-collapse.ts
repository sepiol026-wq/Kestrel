// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { Codecs, persistentAtom } from '@/lib/persisted'

const STORAGE_KEY = 'hermes.desktop.collapsed-providers'

/** Set of provider slugs whose model groups are currently collapsed in the
 *  model picker dropdown. Persisted to localStorage globally — this is a
 *  presentation-layer preference, not a per-profile setting.
 *
 *  We deliberately do NOT prune this set when the active provider catalog
 *  changes (e.g. profile switch, Refresh Models, API key revoked). The catalog
 *  the picker renders is profile-scoped (`getGlobalModelOptions` routes through
 *  `profileScoped()`), so pruning against only the active catalog would delete
 *  a user's collapse preference every time they switch to a profile whose
 *  configured providers don't include it — silently losing state across what
 *  is otherwise a pure presentational toggle.
 *
 *  Provider slugs come from a small bounded configured set (not user input),
 *  so dead entries in the array cost a few bytes and have no observable effect:
 *  the render loop only visits providers present in the active `groups`, and
 *  `collapsedProviders.includes(slug)` against an absent slug is a no-op.
 */
export const $collapsedProviders = persistentAtom<string[]>(STORAGE_KEY, [], Codecs.stringArray)

/** Toggle a provider slug in/out of the collapsed set. */
export function toggleCollapsedProvider(slug: string): void {
  const current = $collapsedProviders.get()
  $collapsedProviders.set(current.includes(slug) ? current.filter(s => s !== slug) : [...current, slug])
}
