// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { takeQueueItem } from '../hooks/useQueue.js'

const destination = { sid: 'chat-a', storedSid: 'chat-a' } as any
const attachments = [{ mime: 'image/png', path: '/w/shot.png' }]

describe('editing the text of a local queued item', () => {
  it('keeps its attachments, destination and control intent, and starts a new submission', () => {
    const queue = [
      {
        attachments,
        controlMethod: 'session.steer' as const,
        destination,
        display: 'look at this',
        executionGeneration: 4,
        failed: true,
        ownerDestination: destination,
        preparedText: 'look at this [image]',
        submissionId: 'sub-1',
        text: 'look at this'
      }
    ]

    const edited = takeQueueItem(queue, 0, 'look at this closely')

    expect(edited).toEqual({
      attachments,
      controlMethod: 'session.steer',
      destination,
      display: 'look at this closely',
      executionGeneration: 4,
      ownerDestination: destination,
      text: 'look at this closely'
    })
  })
})
