// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Tab strip state: whether the code-mode tab is the visible pane, and the ring
// of code-mode runs that pane renders. The session tabs read the live roster
// straight off `$uiState` (see liveSessions.applyLiveSessionRoster), so this
// module owns no session bookkeeping of its own.

import { atom } from 'nanostores'

/** Tools whose calls count as a code-mode run: the code console, the shell, and edits. */
export const CODE_TOOLS: ReadonlySet<string> = new Set([
  'bash',
  'code_mode',
  'edit_file',
  'execute_code',
  'patch',
  'terminal',
  'write_file'
])

/** `MAX_RUNS` caps the ring; older runs fall off the top (nothing scrolls past it). */
export const MAX_RUNS = 40

/** `MAX_TAB_LABEL` caps one tab label in cells before the strip ellipsizes it. */
export const MAX_TAB_LABEL = 18

export interface CodeRun {
  id: string
  /** Tool name, e.g. `execute_code`. */
  name: string
  /** The call's arguments as the wire sent them (the snippet, the patch, the command). */
  input: string
  /** Result text once the call finished; undefined while it is still running. */
  output?: string
  running: boolean
}

export const $codeTab = atom(false)
export const $codeRuns = atom<CodeRun[]>([])

export const setCodeTab = (open: boolean) => $codeTab.set(open)

export function noteCodeStart(id: string, name: string, input: string): void {
  if (!CODE_TOOLS.has(name)) {
    return
  }

  const runs = $codeRuns.get().filter(run => run.id !== id)

  $codeRuns.set([...runs.slice(-(MAX_RUNS - 1)), { id, input, name, running: true }])
}

export function noteCodeEnd(id: string, output?: string): void {
  const runs = $codeRuns.get()

  if (!runs.some(run => run.id === id)) {
    return
  }

  $codeRuns.set(runs.map(run => (run.id === id ? { ...run, output, running: false } : run)))
}

export const resetCodeRuns = () => $codeRuns.set([])

/** A live session as the strip paints it. */
export interface RosterSession {
  id: string
  title: string
  running: boolean
}

/** One tab of the strip: a live session, or the code-mode pane. */
export interface TabEntry {
  id: string
  label: string
  /** Busy/running marker rendered before the label. */
  marker?: string
}

export interface TabWindow {
  /** First visible tab index. */
  start: number
  /** One past the last visible tab index. */
  end: number
  /** Tabs hidden to the left / right of the window. */
  hiddenLeft: number
  hiddenRight: number
  /** Per-tab label capped to `MAX_TAB_LABEL` cells. */
  labels: string[]
}

/**
 * Window of tabs to paint in `maxWidth` cells: the selected tab always fits, and
 * neighbours expand outward while room remains (the window `TagTabs` uses in
 * claude code, minus its `#` prefix bookkeeping).
 */
export function tabWindow(labels: readonly string[], selected: number, maxWidth: number): TabWindow {
  // Hard cut, no ellipsis: the strip fades a long title's tail instead (TabTitle).
  const capped = labels.map(label => (label.length > MAX_TAB_LABEL ? label.slice(0, MAX_TAB_LABEL) : label))
  // " label " + a 1-cell gap between tabs.
  const width = (index: number) => (capped[index]?.length ?? 0) + 3
  const safe = Math.max(0, Math.min(selected, capped.length - 1))

  let start = safe
  let end = safe + 1
  let used = width(safe)

  if (capped.length === 0) {
    return { end: 0, hiddenLeft: 0, hiddenRight: 0, labels: capped, start: 0 }
  }

  while (true) {
    const fitsRight = end < capped.length && used + width(end) <= maxWidth
    const fitsLeft = start > 0 && used + width(start - 1) <= maxWidth

    if (!fitsRight && !fitsLeft) {
      break
    }

    if (fitsRight) {
      used += width(end)
      end += 1
    }

    if (fitsLeft && used + width(start - 1) <= maxWidth) {
      start -= 1
      used += width(start)
    }
  }

  return { end, hiddenLeft: start, hiddenRight: capped.length - end, labels: capped, start }
}
