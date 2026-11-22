// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { openExternalLink } from '@/lib/external-link'

// Optional-arg convenience over the canonical opener — the billing rows pass
// possibly-undefined URLs straight through from their view models.
export function openExternal(url?: string) {
  if (url) {
    openExternalLink(url)
  }
}
