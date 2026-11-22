// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { afterEach, describe, expect, it } from 'vitest'

import { ownViewport } from './timeline'

/**
 * Several chat surfaces are mounted at once — side by side in a split, and
 * stacked as kept-alive inactive tabs. A timeline scrolls its OWN thread.
 */

afterEach(() => {
  document.body.innerHTML = ''
})

const surface = (id: string, hidden = false) => `
  <div ${hidden ? 'data-pane-hidden' : ''}>
    <div data-session-anchor="${id}">
      <div data-slot="aui_thread-viewport" id="viewport-${id}"></div>
      <div data-slot="thread-timeline" id="timeline-${id}"></div>
    </div>
  </div>
`

describe('ownViewport', () => {
  it('resolves the viewport of the surface the timeline lives in', () => {
    document.body.innerHTML = surface('workspace') + surface('session-tile:b')

    expect(ownViewport(document.getElementById('timeline-session-tile:b'))?.id).toBe('viewport-session-tile:b')
    expect(ownViewport(document.getElementById('timeline-workspace'))?.id).toBe('viewport-workspace')
  })

  it('ignores a kept-alive tab that matches first', () => {
    document.body.innerHTML = surface('workspace', true) + surface('session-tile:b')

    expect(ownViewport(document.getElementById('timeline-session-tile:b'))?.id).toBe('viewport-session-tile:b')
  })

  it('falls back to the document when there is no surface around it', () => {
    document.body.innerHTML = '<div data-slot="aui_thread-viewport" id="viewport-lone"></div>'

    expect(ownViewport(null)?.id).toBe('viewport-lone')
  })
})
