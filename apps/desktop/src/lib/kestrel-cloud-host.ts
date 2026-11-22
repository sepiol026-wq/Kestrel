// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * The Webapp tab is served BY a Hermes Cloud agent (its own origin is the
 * agent). Cloud then owns every update: the app itself comes from that agent.
 * Kept free of the session store so low-level modules (notifications, the
 * settings manifest) can ask it without an import cycle.
 */

import { isHermesCloudUrl } from '@hermes/shared'

import { isBrowserHostedDesktop } from '@/lib/platform'

export function servedByHermesCloud(): boolean {
  return typeof window !== 'undefined' && isBrowserHostedDesktop() && isHermesCloudUrl(window.location.origin)
}
