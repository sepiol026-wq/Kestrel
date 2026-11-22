// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Ordered Escape ownership for the app's transient window-level layers.
 *
 * Several surfaces bind their own `window` `keydown` Escape handler (narrow-pane
 * reveal, layout edit mode, the zone editor, full-page overlays). Without a
 * shared order a single Escape fired all of them at once — closing a pinned
 * pane *and* exiting edit mode, or dismissing an overlay *and* the pane beneath
 * it. Radix dialogs already stop propagation / preventDefault, so this is only
 * about the app's own handlers.
 *
 * Contract for a layer handler:
 *   1. bail if `event.defaultPrevented` (a higher, propagation-stopping layer
 *      — a Radix dialog — already handled it);
 *   2. bail unless `isTopEscapeLayer(myPriority)` (a higher app layer is open);
 *   3. otherwise act and `event.preventDefault()`.
 *
 * A layer registers its priority (via `pushEscapeLayer`) only while it's open.
 */

// Higher number = closer to the user. Gaps leave room to slot new layers.
export const ESCAPE_PRIORITY = {
  narrowOverlay: 10,
  layoutEdit: 20,
  zoneEditor: 30,
  overlay: 40,
  // An in-flight pane drag: Esc means "abort the drag", never ALSO exit edit
  // mode / close the overlay the drag started over. Registered only for the
  // drag's few-hundred-ms lifetime (drag-session.ts).
  drag: 50
} as const

const active = new Map<symbol, number>()

/** Register a layer as open; call the returned disposer when it closes. */
export function pushEscapeLayer(priority: number): () => void {
  const key = Symbol('escape-layer')
  active.set(key, priority)

  return () => {
    active.delete(key)
  }
}

/** True when no open layer outranks `priority`, so its handler should act. */
export function isTopEscapeLayer(priority: number): boolean {
  for (const p of active.values()) {
    if (p > priority) {
      return false
    }
  }

  return true
}
