// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { $desktopOnboarding, consumePendingCredentialWarning } from '@/store/onboarding'
import { setOnboardingSurfaceActive } from '@/store/onboarding-presence'

import { applyRuntimeInfo } from './utils'

const initialOnboardingState = $desktopOnboarding.get()

describe('applyRuntimeInfo credential warning while onboarding is open', () => {
  beforeEach(() => {
    consumePendingCredentialWarning()
    $desktopOnboarding.set({ ...initialOnboardingState, reason: null, requested: false })
  })

  afterEach(() => {
    setOnboardingSurfaceActive('onboarding', false)
    consumePendingCredentialWarning()
    $desktopOnboarding.set(initialOnboardingState)
  })

  it('drops the warning: onboarding owns the first run', () => {
    setOnboardingSurfaceActive('onboarding', true)
    applyRuntimeInfo({
      credential_warning: "No API key configured for provider 'openrouter'. First message will fail."
    })

    expect(consumePendingCredentialWarning()).toBeNull()
  })
})
