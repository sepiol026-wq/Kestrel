// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Zone eligibility for SESSION drops — the resolve-side half of the drop
 * contract shared with the zone overlay (hostsSessionDropTarget in
 * pane-shell/tree/store decides PAINT; this decides COMMIT). Living apart
 * from either resolver keeps them from importing each other (and dragging
 * their unrelated module graphs together), while still answering the same
 * question with the same pane predicates.
 */

import { findGroup } from '@/components/pane-shell/tree/model'
import { $layoutTree, isMainStripPane, isSessionStripPane } from '@/components/pane-shell/tree/store'

/** A session may land in any zone hosting a MAIN tile — another chat stack, a
 *  Browser tile, a page — never the sidebar/terminal zones. Returns the pane a
 *  stack anchors to, plus whether the zone hosts a CHAT surface (only those
 *  offer the link-to-composer center; a preview zone's center stacks). */
export function tileZoneHost(groupId: string): { chat: boolean; pane: string } | null {
  const tree = $layoutTree.get()
  const panes = tree ? (findGroup(tree, groupId)?.panes ?? []) : []
  const pane = panes.find(isSessionStripPane) ?? panes.find(isMainStripPane)

  return pane ? { chat: panes.some(isSessionStripPane), pane } : null
}
