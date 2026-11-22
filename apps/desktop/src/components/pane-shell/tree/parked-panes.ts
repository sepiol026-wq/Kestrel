// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * PARKED PANES — registered contributions that are deliberately OUT of the
 * layout tree. A parked pane keeps its contribution, so a keep-alive body (a
 * live Browser guest) stays mounted — hidden and inert in its keep-alive host
 * — while adoption must not dock it back. The contribution's owner parks and
 * unparks it: a preview tab whose session is not on screen.
 *
 * An atom so a parked body can react to being parked (a Browser mutes its
 * page while its session is off screen).
 *
 * Memory-only: after a relaunch there is no live body left to keep.
 */

import { atom } from 'nanostores'

export const $parkedTreePanes = atom<ReadonlySet<string>>(new Set())

export function isTreePaneParked(paneId: string): boolean {
  return $parkedTreePanes.get().has(paneId)
}

export function setTreePaneParked(paneId: string, isParked: boolean): void {
  if (isTreePaneParked(paneId) === isParked) {
    return
  }

  const next = new Set($parkedTreePanes.get())

  if (isParked) {
    next.add(paneId)
  } else {
    next.delete(paneId)
  }

  $parkedTreePanes.set(next)
}
