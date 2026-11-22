// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

/**
 * Issue #95595 proposed-fix #3: the `messageComponents` map handed to
 * ThreadMessageList must keep its REFERENCE IDENTITY across a session switch.
 * If it re-minted, React would unmount/remount every visible message — async
 * re-rendered parts (shiki code blocks) collapse and re-expand, and the whole
 * thread visibly jumps on every tab switch.
 *
 * The memo deps are deliberately only the boolean "definedness" gates (the
 * callbacks themselves reach the composer through a ref), so a plain switch
 * — sessionId changing, callbacks unchanged — must not change the map.
 */
let lastComponents: unknown

vi.mock('@/components/assistant-ui/thread/list', () => ({
  ThreadMessageList: (props: { components: unknown }) => {
    lastComponents = props.components

    return null
  }
}))

vi.mock('@/components/assistant-ui/thread/timeline', () => ({
  ThreadTimeline: () => null
}))

vi.mock('@/components/assistant-ui/thread/status', () => ({
  BackgroundResumeNotice: () => null,
  CenteredThreadSpinner: () => null
}))

vi.mock('@/i18n', () => ({
  // Boot state, which the transcript reads to know whether the tab is signed out, labels itself.
  translateNow: (key: string) => key,
  useI18n: () => ({
    t: {
      assistant: {
        thread: {
          restoreBody: 'restore body',
          restoreConfirm: 'Restore',
          restoreTitle: 'Restore this turn?'
        }
      },
      common: {
        cancel: 'Cancel',
        confirm: 'Confirm',
        done: 'Done',
        loading: 'Loading'
      }
    }
  })
}))

import { Thread } from './index'

describe('Thread messageComponents identity across session switches', () => {
  it('does not re-mint messageComponents when only the session changes', () => {
    const { rerender } = render(<Thread sessionId="session-a" />)
    const first = lastComponents

    expect(first).toBeDefined()

    rerender(<Thread sessionId="session-b" />)

    // THE guard: a switch must keep the component map reference, so the
    // incoming transcript reconciles instead of remounting.
    expect(lastComponents).toBe(first)

    rerender(<Thread sessionId="session-c" />)

    expect(lastComponents).toBe(first)
  })
})
