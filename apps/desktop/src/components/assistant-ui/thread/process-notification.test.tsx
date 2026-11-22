// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'

import { toChatMessages } from '@/lib/chat-messages'
import { toRuntimeMessage } from '@/lib/chat-runtime'
import type { SessionMessage } from '@/types/hermes'

import { stubThreadEnvironment, ThreadRuntime } from '../test-utils'

import { Thread } from '.'

stubThreadEnvironment()
afterEach(cleanup)

it('renders legacy and current process completions as tool disclosures without interpreting their output', () => {
  const headline = 'Background process proc_example completed normally (exit code 0).'
  const output = 'Command: node verify.mjs\nOutput:\n# literal output\n[not a link](https://example.com)'
  const content = `[IMPORTANT: ${headline}\n${output}]`

  for (const display of [
    {},
    {
      display_kind: 'process_complete',
      display_metadata: { display_text: 'Background Process Finished: node verify.mjs' }
    }
  ]) {
    const messages = toChatMessages([{ role: 'user', content, timestamp: 1, ...display } as SessionMessage]).map(
      toRuntimeMessage
    )

    const { container, getByRole, unmount } = render(
      <ThreadRuntime messages={messages}>
        <Thread />
      </ThreadRuntime>
    )

    const title = display.display_metadata?.display_text ?? headline
    const toggle = getByRole('button', { name: title })
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(toggle.closest('[data-conversation-scaffold]')).toBeTruthy()
    expect(container.textContent).not.toContain('# literal output')
    expect(container.querySelector('details')).toBeNull()

    fireEvent.click(toggle)
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(container.textContent).toContain(output)
    expect(container.querySelector('a[href="https://example.com"]')).toBeNull()

    fireEvent.click(toggle)
    expect(container.textContent).not.toContain('# literal output')
    unmount()
  }
})
