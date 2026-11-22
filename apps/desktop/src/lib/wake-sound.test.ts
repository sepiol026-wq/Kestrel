// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { $hapticsMuted } from '@/store/haptics'

import { playWakeSound } from './wake-sound'

// Minimal WebAudio doubles: enough to record that playWakeSound wired
// oscillators to the destination when it should, and stayed silent when muted.
class FakeParam {
  setValueAtTime = vi.fn()
  exponentialRampToValueAtTime = vi.fn()
}

class FakeOscillator {
  type = 'sine'
  frequency = new FakeParam()
  connect = vi.fn()
  start = vi.fn()
  stop = vi.fn()
}

class FakeGain {
  gain = new FakeParam()
  connect = vi.fn()
}

let oscillators: FakeOscillator[]

class FakeAudioContext {
  state = 'running'
  currentTime = 0
  destination = {}
  resume = vi.fn().mockResolvedValue(undefined)

  createOscillator() {
    const osc = new FakeOscillator()
    oscillators.push(osc)

    return osc
  }

  createGain() {
    return new FakeGain()
  }
}

describe('playWakeSound', () => {
  beforeEach(() => {
    oscillators = []
    $hapticsMuted.set(false)
    vi.stubGlobal('AudioContext', FakeAudioContext)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    $hapticsMuted.set(false)
  })

  it('stays silent when the shared sound-mute toggle is on', () => {
    $hapticsMuted.set(true)
    playWakeSound()
    expect(oscillators).toHaveLength(0)
  })

  it('never throws when WebAudio is unavailable', () => {
    vi.stubGlobal('AudioContext', undefined)
    expect(() => playWakeSound()).not.toThrow()
  })
})
