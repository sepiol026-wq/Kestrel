// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { bareHost, type EmbedMatcher } from './types'

export const twitter: EmbedMatcher = url => {
  const host = bareHost(url.hostname)

  if (host !== 'twitter.com' && host !== 'x.com') {
    return null
  }

  const segments = url.pathname.split('/').filter(Boolean)
  const statusIndex = segments.indexOf('status')
  const id = statusIndex >= 0 ? segments[statusIndex + 1] : ''

  if (!/^\d+$/.test(id || '')) {
    return null
  }

  return {
    id: `twitter:${id}`,
    label: 'X',
    maxWidth: 480,
    provider: 'twitter',
    renderer: 'tweet',
    sourceUrl: url.toString(),
    tweetId: id
  }
}
