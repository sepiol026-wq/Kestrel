// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

'use client'

import { type CSSProperties, useMemo } from 'react'

import type { FrameEmbed } from './providers/types'
import { useIsDark } from './use-is-dark'

const ALLOW = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'

// Spotify paints a white backdrop behind its card; theme=0 gives the dark
// player and the card wrapper's overflow-hidden clips the corners.
function spotifySrc(embedUrl: string, isDark: boolean): string {
  const url = new URL(embedUrl)

  url.searchParams.set('utm_source', 'generator')

  if (isDark) {
    url.searchParams.set('theme', '0')
  }

  return url.toString()
}

export default function SpotifyEmbedRenderer({ descriptor }: { descriptor: FrameEmbed }) {
  const isDark = useIsDark()
  const src = useMemo(() => spotifySrc(descriptor.embedUrl, isDark), [descriptor.embedUrl, isDark])

  // Match the iframe's own (light) scheme — a `dark` mismatch makes the browser
  // paint an opaque white Canvas behind it. theme=0 still gives the dark player.
  const style: CSSProperties = {
    colorScheme: 'light',
    height: descriptor.height
  }

  return (
    <iframe
      allow={ALLOW}
      className="block w-full border-0 bg-transparent"
      loading="lazy"
      src={src}
      style={style}
      title="Spotify embed"
    />
  )
}
