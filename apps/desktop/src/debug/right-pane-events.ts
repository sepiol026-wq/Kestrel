// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

export type RightPanePerfEvent =
  'project-tree-render' | 'project-tree-row-render' | 'terminal-fit-active' | 'terminal-fit-hidden' | 'terminal-measure'

export interface RightPanePerfSnapshot {
  counts: Record<RightPanePerfEvent, number>
  details: Partial<Record<RightPanePerfEvent, Record<string, number>>>
  rows: Record<string, number>
}

declare global {
  interface Window {
    __RIGHT_PANE_PERF__?: {
      clear: () => void
      mark: (event: RightPanePerfEvent, detail?: string) => void
      snapshot: () => RightPanePerfSnapshot
      start: () => void
      stop: () => void
    }
  }
}

/** Tiny production-safe callsite; the recorder exists only in dev/perf builds. */
export function markRightPanePerf(event: RightPanePerfEvent, detail?: string): void {
  window.__RIGHT_PANE_PERF__?.mark(event, detail)
}
