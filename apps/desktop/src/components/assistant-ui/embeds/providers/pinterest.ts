// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { bareHost, type EmbedMatcher } from './types'

export const pinterest: EmbedMatcher = url => {
  // Pinterest runs many locale TLDs (pinterest.co.uk, fr.pinterest.com, ...).
  if (!bareHost(url.hostname).includes('pinterest.')) {
    return null
  }

  const segments = url.pathname.split('/').filter(Boolean)

  if (segments[0] !== 'pin' || !/^\d+$/.test(segments[1] || '')) {
    return null
  }

  const id = segments[1]

  return {
    embedUrl: `https://assets.pinterest.com/ext/embed.html?id=${id}`,
    // Pinterest's "small" pin size — the default card is too dominant inline.
    height: 380,
    id: `pinterest:${id}`,
    label: 'Pinterest',
    maxWidth: 236,
    provider: 'pinterest',
    renderer: 'frame',
    sourceUrl: url.toString()
  }
}
