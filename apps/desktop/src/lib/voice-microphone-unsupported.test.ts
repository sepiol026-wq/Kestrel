// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { micError } from '@/app/chat/composer/hooks/use-mic-recorder'
import { en } from '@/i18n/en'

import { monitorSpeechDuringPlayback } from './voice-barge-in'
import { VoiceLiveSession } from './voice-live'

// A Webapp opened over plain HTTP from another machine has no navigator.mediaDevices; nor has jsdom.
afterEach(() => vi.unstubAllGlobals())

it('live voice fails with "microphone unsupported" without mediaDevices, before opening a peer', async () => {
  expect(navigator.mediaDevices).toBeUndefined()
  const peers = vi.fn()

  vi.stubGlobal('RTCPeerConnection', class {
    constructor() { peers() }
    addEventListener() {}
    close() {}
  })

  const session = new VoiceLiveSession({ onClosed: vi.fn(), onDelegation: vi.fn(), onError: vi.fn() })
  const failure = await session.start([]).catch((error: unknown) => error)

  expect(micError(failure, en.notifications.voice).message).toBe(en.notifications.voice.microphoneUnsupported)
  expect(peers).not.toHaveBeenCalled()
})

describe('on an insecure origin', () => {
  beforeEach(() => Object.defineProperty(window, 'isSecureContext', { configurable: true, value: false }))
  afterEach(() => {
    Reflect.deleteProperty(window, 'isSecureContext')
    delete document.documentElement.dataset.hermesDesktopHost
  })

  const unsupported = () => micError(new DOMException('no mic here', 'NotSupportedError'), en.notifications.voice)

  it('the Webapp says HTTPS or a tunnel brings the microphone back', () => {
    document.documentElement.dataset.hermesDesktopHost = 'browser'

    expect(unsupported().message).toBe(en.notifications.voice.microphoneNeedsHttps)
  })

  it('native Desktop keeps the plain "microphone unsupported" copy', () => {
    expect(unsupported().message).toBe(en.notifications.voice.microphoneUnsupported)
  })
})

it('barge-in never reaches for a microphone it cannot have', () => {
  const audioContext = vi.fn()
  vi.stubGlobal('AudioContext', audioContext)

  const stop = monitorSpeechDuringPlayback({ onSpeech: vi.fn(), onUtterance: vi.fn() })

  expect(audioContext).not.toHaveBeenCalled()
  stop()
})
