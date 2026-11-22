// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it, vi } from 'vitest'

import { $voicePartial, handleVoiceCapture } from '../app/voicePartialStore.js'

describe('handleVoiceCapture', () => {
  it('shows live STT text until the capture settles', () => {
    const voice = { setProcessing: vi.fn(), setRecording: vi.fn() }

    handleVoiceCapture({ payload: { text: 'schedule a meeting' }, type: 'voice.partial' } as any, voice)
    handleVoiceCapture({ payload: { state: 'transcribing' }, type: 'voice.status' } as any, voice)
    expect($voicePartial.get()).toBe('schedule a meeting')
    expect(voice.setProcessing).toHaveBeenLastCalledWith(true)

    handleVoiceCapture({ payload: { state: 'idle' }, type: 'voice.status' } as any, voice)
    expect($voicePartial.get()).toBe('')
    expect(voice.setRecording).toHaveBeenLastCalledWith(false)
  })
})
