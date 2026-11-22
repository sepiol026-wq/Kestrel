// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { PassThrough } from 'node:stream'

import { renderSync } from '@hermes/ink'
import React from 'react'
import stripAnsi from 'strip-ansi'
import { afterEach, describe, expect, it } from 'vitest'

import { $codeTab, noteCodeEnd, noteCodeStart, resetCodeRuns, setCodeTab } from '../app/tabStore.js'
import { patchUiState, resetUiState } from '../app/uiStore.js'
import { CodePane } from '../components/codePane.js'
import { TabBar, tabCellColors } from '../components/tabBar.js'
import { DEFAULT_THEME } from '../theme.js'

const paint = (element: React.ReactElement, columns = 100): string => {
  const stdout = Object.assign(new PassThrough(), { columns, rows: 24 })
  const frames: string[] = []
  stdout.on('data', (chunk: Buffer) => frames.push(chunk.toString()))

  const view = renderSync(element, {
    stdin: new PassThrough() as unknown as NodeJS.ReadStream,
    stdout: stdout as unknown as NodeJS.WriteStream
  })

  view.unmount()
  view.cleanup()

  // One row per line, trailing cells trimmed: assertions then read like the screen.
  return stripAnsi(frames.join(''))
    .split('\n')
    .map(line => line.replace(/\s+$/, ''))
    .join('\n')
}

const noopActions = { activateLiveSession: () => {}, newLiveSession: () => {} }

const twoSessions = () =>
  patchUiState({
    roster: [
      { id: 'a', running: false, title: 'vector search' },
      { id: 'b', running: true, title: 'hotaru port' }
    ],
    sid: 'a',
    theme: DEFAULT_THEME
  })

afterEach(() => {
  resetUiState()
  resetCodeRuns()
  setCodeTab(false)
})

describe('TabBar', () => {
  it('numbers each live session tab and keeps its title beside the number', () => {
    patchUiState({
      roster: [
        { id: 'a', running: false, title: 'vector search' },
        { id: 'b', running: false, title: 'hotaru port' }
      ],
      sid: 'a',
      theme: DEFAULT_THEME
    })

    const view = paint(<TabBar actions={noopActions} cols={100} />)

    // The cell is " 1 vector search " — number, then title, in that order.
    expect(view).toContain('1 vector search')
    expect(view).toContain('2 hotaru port')
    // Modes are a separate group behind a divider, after every session tab.
    expect(view).toContain('▐ code ▌')
    expect(view.indexOf('hotaru port')).toBeLessThan(view.indexOf('▐ code ▌'))
    expect(view.indexOf('▐ code ▌')).toBeLessThan(view.indexOf('+ new session'))
  })

  it('shows the current session as a tab even before it joins the roster', () => {
    patchUiState({
      roster: [{ id: 'a', running: false, title: 'older' }],
      sessionTitle: 'fresh chat',
      sid: 'brand-new',
      theme: DEFAULT_THEME
    })

    const view = paint(<TabBar actions={noopActions} cols={100} />)

    expect(view).toContain('fresh chat')
    expect(view.indexOf('older')).toBeLessThan(view.indexOf('fresh chat'))
  })

  it('marks the selected session, not the first one', () => {
    patchUiState({
      roster: [
        { id: 'a', running: false, title: 'first' },
        { id: 'b', running: false, title: 'second' }
      ],
      sid: 'b',
      theme: DEFAULT_THEME
    })

    const view = paint(<TabBar actions={noopActions} cols={100} />)

    // Selected tab (2) is the one the window is built around: it stays visible
    // even when the strip is too narrow for both.
    expect(paint(<TabBar actions={noopActions} cols={40} />)).toContain('2 second')
  })

  it('paints the selected tab on the selection background, and the rest plain', () => {
    // Ink renders styles through chalk, which is level 0 under a test runner: assert
    // the decision the cell paints with, not the escape codes ansi would carry.
    expect(tabCellColors(true, DEFAULT_THEME)).toEqual({ bg: DEFAULT_THEME.color.selectionBg, fg: DEFAULT_THEME.color.text })
    expect(tabCellColors(false, DEFAULT_THEME)).toEqual({ bg: undefined, fg: DEFAULT_THEME.color.muted })
  })

  it('swaps a running session number for a spinner frame', () => {
    twoSessions()

    const view = paint(<TabBar actions={noopActions} cols={100} />)

    expect(view).toContain('vector search')
    expect(/[◐◓◑◒] hotaru port/.test(view)).toBe(true)
  })

  it('reports the hidden side instead of squeezing titles', () => {
    patchUiState({
      roster: Array.from({ length: 12 }, (_, i) => ({ id: `s${i}`, running: false, title: `session ${i}` })),
      sid: 's0',
      theme: DEFAULT_THEME
    })

    const view = paint(<TabBar actions={noopActions} cols={80} />)

    expect(view).toMatch(/→\d+/)
    expect(view).not.toContain('session 11')
  })

  it('opens the code tab with alt+c and closes it again', () => {
    setCodeTab(true)
    patchUiState({ theme: DEFAULT_THEME })

    expect($codeTab.get()).toBe(true)
    setCodeTab(false)
    expect($codeTab.get()).toBe(false)
  })
})

describe('CodePane', () => {
  it('renders a finished run as snippet, then the output it printed', () => {
    patchUiState({ theme: DEFAULT_THEME })
    noteCodeStart('t1', 'execute_code', 'print(1 + 1)')
    noteCodeEnd('t1', '2')

    const view = paint(<CodePane cols={80} />)
    const lines = view.split('\n')

    expect(lines.some(line => line.includes('execute_code') && line.includes('●'))).toBe(true)
    // Body lines carry the gutter: the snippet, then the output under its label.
    expect(lines.some(line => line.includes('│ print(1 + 1)'))).toBe(true)
    expect(lines.some(line => line.includes('out'))).toBe(true)
    expect(lines.some(line => line.includes('│ 2'))).toBe(true)
    expect(view).not.toContain('running')
  })

  it('keeps a running call marked until its result lands', () => {
    patchUiState({ theme: DEFAULT_THEME })
    noteCodeStart('t2', 'terminal', 'ls -la')

    const view = paint(<CodePane cols={80} />)

    expect(view).toContain('terminal')
    expect(view).toContain('│ ls -la')
    expect(view).toContain('running')
  })

  it('shows the tail of a long output, not the head', () => {
    patchUiState({ theme: DEFAULT_THEME })
    noteCodeStart('t3', 'execute_code', 'for i in range(200): print(i)')
    noteCodeEnd('t3', Array.from({ length: 200 }, (_, i) => `row ${i}`).join('\n'))

    const view = paint(<CodePane cols={80} />)

    expect(view).toContain('row 199')
    expect(view).not.toContain('row 0\n')
  })

  it('shows the empty state before anything ran', () => {
    patchUiState({ theme: DEFAULT_THEME })

    expect(paint(<CodePane cols={80} />)).toContain('nothing ran yet')
  })
})
