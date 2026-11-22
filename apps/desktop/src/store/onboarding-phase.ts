// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { atom } from 'nanostores'

/** Where first-run onboarding is: `shown` while it runs, then how it ended. Funnel telemetry reads it. */
export type OnboardingPhase = 'done' | 'failed' | 'idle' | 'shown' | 'skipped'

export const $onboardingPhase = atom<OnboardingPhase>('idle')
