// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useCallback, useSyncExternalStore } from 'react'

import { registry } from '../registry'
import type { Contribution } from '../types'

/** Subscribe to the resolved contributions for an area. The subscription is
 *  scoped to `area`, so a slot re-renders only when ITS area mutates — a
 *  statusbar registration never re-renders a titlebar (or panes) slot. */
export function useContributions(area: string): readonly Contribution[] {
  const subscribe = useCallback((onChange: () => void) => registry.subscribeArea(area, onChange), [area])
  const getSnapshot = useCallback(() => registry.getArea(area), [area])

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
