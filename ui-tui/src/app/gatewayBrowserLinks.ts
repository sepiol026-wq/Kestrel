// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { BillingStepUpVerificationPayload, FreeTierChallengePayload } from '@hermes/shared/gateway-events'

import { t } from '../i18n/runtime.js'

// Links the headless gateway needs the user to open in a browser: it cannot open one or print
// where the user sees it, so the TUI shows the link (clickable/copyable) and opens it itself.

type Sys = (text: string) => void
type OpenUrl = (url: string) => unknown

/**
 * `billing.step_up.verification`: the billing step-up device flow. The event arrives while the
 * billing.step_up RPC is still polling (and may outlive its 120s timeout), so the link, not the
 * RPC result, is the source of truth.
 */
export function createBillingVerificationPresenter(
  sys: Sys,
  openExternalUrl: OpenUrl
): (payload: BillingStepUpVerificationPayload | undefined) => void {
  return payload => {
    const url = payload?.verification_url

    if (!url) {
      return
    }

    sys(t('gatewayMsg.billing.openLinkRemoteSpending'))
    sys(url)

    if (payload.user_code) {
      sys(t('gatewayMsg.billing.enterCode', payload.user_code))
    }

    void openExternalUrl(url)
  }
}

/**
 * `free_tier.challenge`: the account service wants a browser check before it
 * mints the free-tier token (hermes_cli/anon_challenge.py). The gateway polls
 * for the result on its own; this only puts the link where the user is. An
 * optional check is the desktop's to run hidden, never the user's. One browser
 * tab per ticket, however many attempts resume it.
 */
export function createFreeTierChallengePresenter(
  sys: Sys,
  openExternalUrl: OpenUrl
): (challenge: FreeTierChallengePayload | undefined) => void {
  const opened = new Set<string>()

  return challenge => {
    if (!challenge?.required || !challenge.url) {
      return
    }

    sys(challenge.message)
    sys(challenge.url)

    if (!opened.has(challenge.url)) {
      opened.add(challenge.url)
      void openExternalUrl(challenge.url)
    }
  }
}
