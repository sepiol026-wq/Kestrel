// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { $displayTimestamps, setDisplayTimestampsFromConfig } from '@/store/display-timestamps'

import { TimelineTimestamp } from './timeline-timestamp'

afterEach(cleanup)

beforeEach(() => {
  $displayTimestamps.set(false)
})

describe('setDisplayTimestampsFromConfig', () => {
  it('accepts boolean and string forms, defaulting off', () => {
    setDisplayTimestampsFromConfig(true)
    expect($displayTimestamps.get()).toBe(true)

    setDisplayTimestampsFromConfig(false)
    expect($displayTimestamps.get()).toBe(false)

    setDisplayTimestampsFromConfig('true')
    expect($displayTimestamps.get()).toBe(true)

    setDisplayTimestampsFromConfig(undefined)
    expect($displayTimestamps.get()).toBe(false)
  })
})

describe('TimelineTimestamp display.timestamps gate', () => {
  const timestamp = new Date('2026-05-01T00:00:00.000Z').getTime() / 1000

  it('renders nothing while display.timestamps is off (the default)', () => {
    const { container } = render(<TimelineTimestamp timestamp={timestamp} />)

    expect(container.querySelector('[data-slot="timeline-timestamp"]')).toBeNull()
  })

  it('renders the stamp once display.timestamps is on', () => {
    $displayTimestamps.set(true)

    const { container } = render(<TimelineTimestamp timestamp={timestamp} />)

    expect(container.querySelector('[data-slot="timeline-timestamp"]')).toBeTruthy()
  })
})
