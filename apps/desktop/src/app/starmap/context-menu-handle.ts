// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Registered context-menu ownership for the Star Map canvas.
 *
 * The app-wide menu listens on window during capture, before React's canvas
 * handler. It asks this handle whether the click hit a node: hits belong to
 * the Star Map, while misses keep flowing to the shell fallback.
 */

export interface StarMapContextMenuHandle {
  openNodeMenuAt: (clientX: number, clientY: number) => boolean
}

const handles = new WeakMap<HTMLCanvasElement, StarMapContextMenuHandle>()

/** Register the handle for a Star Map canvas. Returns an idempotent remove. */
export function registerStarMapContextMenu(canvas: HTMLCanvasElement, handle: StarMapContextMenuHandle): () => void {
  handles.set(canvas, handle)

  return () => {
    if (handles.get(canvas) === handle) {
      handles.delete(canvas)
    }
  }
}

/** Open the node menu when element is a registered canvas and the point hits a node. */
export function openStarMapNodeMenuFor(element: Element | null, clientX: number, clientY: number): boolean {
  if (!(element instanceof HTMLCanvasElement)) {
    return false
  }

  return handles.get(element)?.openNodeMenuAt(clientX, clientY) ?? false
}
