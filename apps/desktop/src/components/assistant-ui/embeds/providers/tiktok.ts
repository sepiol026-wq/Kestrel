// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { bareHost, type EmbedMatcher } from './types'

export const tiktok: EmbedMatcher = url => {
  if (bareHost(url.hostname) !== 'tiktok.com') {
    return null
  }

  const segments = url.pathname.split('/').filter(Boolean)
  const videoIndex = segments.indexOf('video')
  const id = videoIndex >= 0 ? segments[videoIndex + 1] : ''

  if (!/^\d+$/.test(id || '')) {
    return null
  }

  return {
    // The official player is a clean dark video iframe (no white blockquote
    // chrome), so it goes through the plain-iframe frame path, sized 9:16.
    aspectRatio: 9 / 16,
    embedUrl: `https://www.tiktok.com/player/v1/${id}`,
    id: `tiktok:${id}`,
    label: 'TikTok',
    maxWidth: 365,
    provider: 'tiktok',
    renderer: 'frame',
    sourceUrl: url.toString()
  }
}
