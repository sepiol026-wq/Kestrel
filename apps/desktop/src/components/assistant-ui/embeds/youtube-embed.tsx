// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

'use client'

import { useEffect, useMemo, useState } from 'react'

import type { FrameEmbed } from './providers/types'
import { useIsDark } from './use-is-dark'

const YOUTUBE_ALLOW =
  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen'

const hasHttpOrigin = () =>
  typeof window !== 'undefined' &&
  (window.location.protocol === 'http:' || window.location.protocol === 'https:') &&
  Boolean(window.location.origin) &&
  window.location.origin !== 'null'

function youtubeSrc(embedUrl: string): string {
  const url = new URL(embedUrl)

  // Only pass origin when it is an HTTP(S) origin; custom schemes (app://,
  // file://) can make the player reject otherwise embeddable videos.
  if (hasHttpOrigin()) {
    url.searchParams.set('origin', window.location.origin)
  }

  return url.toString()
}

/** The same video and params, served through the Desktop loopback wrapper. */
export function wrappedYoutubeSrc(embedUrl: string, hostOrigin: string): string {
  const url = new URL(embedUrl)
  const id = url.pathname.split('/').pop() ?? ''

  return `${hostOrigin}/youtube/${encodeURIComponent(id)}${url.search}`
}

// The packaged renderer is a file:// page, which YouTube rejects (error 153), so
// there the player is hosted by a loopback wrapper page (electron/embed-host.ts).
// Dev and web renderers already have an http origin and embed directly.
function usePlayerSrc(embedUrl: string): null | string {
  const direct = useMemo(() => youtubeSrc(embedUrl), [embedUrl])
  const getHostOrigin = hasHttpOrigin() ? undefined : window.hermesDesktop?.getEmbedHostOrigin
  const [wrapped, setWrapped] = useState<null | string>(null)

  useEffect(() => {
    if (!getHostOrigin) {
      return
    }

    let live = true

    getHostOrigin()
      .then(origin => live && setWrapped(wrappedYoutubeSrc(embedUrl, origin)))
      .catch(() => live && setWrapped(direct))

    return () => {
      live = false
    }
  }, [direct, embedUrl, getHostOrigin])

  return getHostOrigin ? wrapped : direct
}

// Keep this as a plain iframe and let YouTube render its native player/error UI.
export default function YouTubeEmbedRenderer({ descriptor }: { descriptor: FrameEmbed }) {
  const isDark = useIsDark()
  const src = usePlayerSrc(descriptor.embedUrl)

  if (!src) {
    return <div className="block aspect-video w-full" />
  }

  // Width is capped to the ratio by UrlEmbed, so aspect-video sizes height ≤ cap.
  return (
    <iframe
      allow={YOUTUBE_ALLOW}
      allowFullScreen
      className="block aspect-video w-full border-0 bg-transparent"
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      scrolling="no"
      src={src}
      style={{ colorScheme: isDark ? 'dark' : 'light' }}
      title="YouTube embed"
    />
  )
}
