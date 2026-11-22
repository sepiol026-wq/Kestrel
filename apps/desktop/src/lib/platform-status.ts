// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { StatusTone } from '@/components/status-dot'

// One reading of a messaging platform's runtime state, shared by the Messaging
// page and the gateway menu so the same bot never shows two different tones.
// Anything enabled that isn't connected or failed (connecting, retrying,
// restart needed, gateway stopped, needs setup) is waiting on something: warn.
const STATE_TONE: Record<string, StatusTone> = {
  connected: 'good',
  disabled: 'muted',
  fatal: 'bad',
  startup_failed: 'bad'
}

interface PlatformStatusInput {
  enabled?: boolean
  state?: null | string
}

export function platformStatusTone({ enabled = true, state }: PlatformStatusInput): StatusTone {
  if (!enabled) {
    return 'muted'
  }

  return (state && STATE_TONE[state]) || 'warn'
}
