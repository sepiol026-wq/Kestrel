// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { GatewayEvent } from '@hermes/shared'

import { noteOnboardingEnded } from '@/store/onboarding-run'

import type { GatewayEventContext } from './types'

/** onboarding.ended: a first-run run ended. Every source's event counts: the run is the install's, and
 *  the window showing it may be subscribed to another chat or profile. */
export function handleOnboardingEvent({ event }: GatewayEventContext): boolean {
  if (event.type !== 'onboarding.ended') {
    return false
  }

  // SAFETY: the type check above; the backend checks the payload against OnboardingEndedPayload.
  const ended = (event as GatewayEvent<'onboarding.ended'>).payload

  if (ended) {
    noteOnboardingEnded(ended)
  }

  return true
}
