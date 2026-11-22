// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { prependQueueItem, queueItem, removeAtInPlace, takeQueueItem } from '../hooks/useQueue.js'

describe('removeAtInPlace', () => {
  it('removes the item at the given index in place', () => {
    const arr = ['a', 'b', 'c']

    removeAtInPlace(arr, 1)
    expect(arr).toEqual(['a', 'c'])
  })

  it('is a no-op when the index is out of bounds', () => {
    const arr = ['a', 'b']

    removeAtInPlace(arr, -1)
    removeAtInPlace(arr, 5)
    expect(arr).toEqual(['a', 'b'])
  })
})

describe('queue items', () => {
  it('keeps execution text and collapsed display together through edit and requeue', () => {
    const display = '[[ first.. [3 lines] .. last ]]'
    const text = 'first\nmiddle\nlast'
    const queue = [queueItem(text, display), queueItem('next')]

    const edited = takeQueueItem(queue, 0, `before ${display} after`)

    expect(edited).toEqual({
      display: `before ${display} after`,
      text: `before ${text} after`
    })
    expect(queue).toEqual([queueItem('next')])

    prependQueueItem(queue, edited!)
    expect(queue[0]).toEqual({
      display: `before ${display} after`,
      text: `before ${text} after`
    })
  })

  it('treats a rewritten collapsed label as literal edited text', () => {
    const queue = [queueItem('full payload', '[[ collapsed ]]')]

    expect(takeQueueItem(queue, 0, 'replacement')).toEqual(queueItem('replacement'))
  })
})
