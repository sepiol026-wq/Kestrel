// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useLocation } from 'react-router'

import { appViewForPath, isOverlayView } from '@/app/routes'

/**
 * True while a full-screen route overlay (settings, agents, command-center, …)
 * is showing.
 *
 * A portaled Radix modal sits above the app shell, so it would cover such a
 * route. Any modal that sends the user to one (e.g. "set up image generation" →
 * `/settings`) can `if (useRouteOverlayActive()) return null` to *yield* the
 * screen — its open state lives in a store, so it stays open — and reappear,
 * re-running its mount effects (a free refresh), when the route overlay closes.
 */
export function useRouteOverlayActive(): boolean {
  const { pathname } = useLocation()

  return isOverlayView(appViewForPath(pathname))
}
