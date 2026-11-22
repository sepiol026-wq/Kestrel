// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest'

import { registerFloatingComposer } from './floating-target'
import { focusComposerInput } from './focus'

let unregister: (() => void) | undefined

afterEach(() => {
  unregister?.()
  unregister = undefined
  globalThis.document.body.innerHTML = ''
  globalThis.window.getSelection()?.removeAllRanges()
  vi.useRealTimers()
})

it.each(['audio', 'video'])('leaves native %s focus with the media controls until a new composer request', tag => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'] })
  const surface = globalThis.document.createElement('div')
  surface.dataset.chatSurface = ''
  surface.dataset.composerSurfaceId = 'media-owner'
  const media = globalThis.document.createElement(tag)
  media.setAttribute('controls', '')
  media.tabIndex = 0
  const host = globalThis.document.createElement('div')
  host.dataset.composerOwner = 'media-owner'
  const editor = globalThis.document.createElement('div')
  editor.dataset.slot = 'composer-rich-input'
  editor.tabIndex = 0
  host.append(editor)
  surface.append(media, host)
  globalThis.document.body.append(surface)
  unregister = registerFloatingComposer('media-owner', { groupId: 'media-group', target: 'main' })
  const focusin = vi.fn()
  surface.addEventListener('focusin', focusin)

  // Moving directly from a blurred composer to the native controls queues
  // composer retries before the same pointer gesture gives media focus.
  media.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerType: 'mouse', buttons: 0, clientX: 50, clientY: 61 }))
  expect(globalThis.document.activeElement).toBe(editor)
  focusin.mockClear()
  media.focus()
  expect(globalThis.document.activeElement).toBe(media)
  expect(focusin).toHaveBeenCalledTimes(1)
  vi.runAllTimers()
  expect(globalThis.document.activeElement).toBe(media)
  media.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerType: 'mouse', buttons: 0, clientX: 52, clientY: 63 }))
  expect(globalThis.document.activeElement).toBe(media)

  focusComposerInput(editor)
  vi.runAllTimers()
  expect(globalThis.document.activeElement).toBe(editor)
})
