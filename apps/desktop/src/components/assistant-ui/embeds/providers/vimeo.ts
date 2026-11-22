// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { bareHost, type EmbedMatcher } from './types'

export const vimeo: EmbedMatcher = url => {
  const host = bareHost(url.hostname)

  if (host !== 'vimeo.com' && host !== 'player.vimeo.com') {
    return null
  }

  // The clip id is the last all-digits segment, covering vimeo.com/123,
  // /channels/x/123, /groups/x/videos/123, and player/video/123.
  const id = url.pathname
    .split('/')
    .filter(Boolean)
    .reverse()
    .find(segment => /^\d+$/.test(segment))

  if (!id) {
    return null
  }

  return {
    aspectRatio: 16 / 9,
    embedUrl: `https://player.vimeo.com/video/${id}`,
    id: `vimeo:${id}`,
    label: 'Vimeo',
    maxWidth: 640,
    provider: 'vimeo',
    renderer: 'frame',
    sourceUrl: url.toString()
  }
}
