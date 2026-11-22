// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * The regression that motivates this file: cmdk calls the root
 * `onValueChange` only in controlled mode (a set `value` prop). The palette
 * is uncontrolled, so a highlight preview wired to that prop never fires.
 * The watcher must read the cmdk store instead, which works in both modes.
 */

import { render } from '@testing-library/react'
import { Command } from 'cmdk'
import { describe, expect, it, vi } from 'vitest'

import { stubMenuDomApis, stubResizeObserver } from '@/test/jsdom'

import { HighlightWatcher } from './highlight-watcher'

stubResizeObserver()
stubMenuDomApis()

const palette = (onValue: (value: string) => void) => (
  <Command>
    <HighlightWatcher onValue={onValue} />
    <Command.List>
      <Command.Item value="alpha">Alpha</Command.Item>
      <Command.Item value="beta">Beta</Command.Item>
    </Command.List>
  </Command>
)

describe('HighlightWatcher', () => {
  it('reports the highlight from the cmdk store in uncontrolled mode', () => {
    const onValue = vi.fn()

    render(palette(onValue))

    // cmdk auto-highlights the first item on mount.
    expect(onValue).toHaveBeenCalledWith('alpha')
  })
})
