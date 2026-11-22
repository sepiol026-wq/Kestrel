// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { RightPanePerfEvent, RightPanePerfSnapshot } from './right-pane-events'

const eventNames: RightPanePerfEvent[] = [
  'project-tree-render',
  'project-tree-row-render',
  'terminal-fit-active',
  'terminal-fit-hidden',
  'terminal-measure'
]

const blankCounts = (): Record<RightPanePerfEvent, number> =>
  Object.fromEntries(eventNames.map(name => [name, 0])) as Record<RightPanePerfEvent, number>

if (typeof window !== 'undefined' && !window.__RIGHT_PANE_PERF__) {
  let recording = false
  let counts = blankCounts()
  let details: RightPanePerfSnapshot['details'] = {}
  let rows: Record<string, number> = {}

  window.__RIGHT_PANE_PERF__ = {
    clear: () => {
      counts = blankCounts()
      details = {}
      rows = {}
    },
    mark: (event, detail) => {
      if (!recording) {
        return
      }

      counts[event] += 1

      if (detail) {
        const eventDetails = details[event] ?? {}
        eventDetails[detail] = (eventDetails[detail] ?? 0) + 1
        details[event] = eventDetails

        if (event === 'project-tree-row-render') {
          rows[detail] = (rows[detail] ?? 0) + 1
        }
      }
    },
    snapshot: (): RightPanePerfSnapshot => ({
      counts: { ...counts },
      details: Object.fromEntries(Object.entries(details).map(([event, eventDetails]) => [event, { ...eventDetails }])),
      rows: { ...rows }
    }),
    start: () => {
      counts = blankCounts()
      details = {}
      rows = {}
      recording = true
    },
    stop: () => {
      recording = false
    }
  }
}
