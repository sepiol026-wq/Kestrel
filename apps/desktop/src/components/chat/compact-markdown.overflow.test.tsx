// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { CompactMarkdown } from './compact-markdown'

afterEach(cleanup)

// #70451: CompactMarkdown renders tool detail bodies, where a fenced log line
// used to grow a nested horizontal scrollbar. Fences soft-wrap; tables keep
// content-sized columns and scroll inside their own wrapper, like code cards.
describe('CompactMarkdown overflow containment', () => {
  it('soft-wraps fenced code instead of scrolling sideways', () => {
    const longToken = 'x'.repeat(500)

    const { container } = render(<CompactMarkdown text={`\`\`\`text\n${longToken}\n\`\`\``} />)

    const pre = container.querySelector('pre')!
    expect(pre).toBeTruthy()
    expect(pre.className).toContain('overflow-x-hidden')
    expect(pre.className).toContain('whitespace-pre-wrap')
    expect(pre.className).not.toContain('overflow-x-auto')
  })
})
