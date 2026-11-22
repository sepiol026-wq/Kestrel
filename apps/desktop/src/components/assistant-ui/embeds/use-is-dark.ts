// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useEffect, useState } from 'react'

import { useThemeEpoch } from '@/hooks/use-theme-epoch'

const isDarkNow = () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')

// Tracks the app's dark/light mode off the `dark` class on <html> (set by
// themes/context.tsx). Embeds that theme their own content (tweets) read this.
// Rides the shared theme-repaint observer; setState bails on an unchanged
// boolean, so style-only repaints don't re-render.
export function useIsDark(): boolean {
  const epoch = useThemeEpoch()
  const [dark, setDark] = useState(isDarkNow)

  useEffect(() => setDark(isDarkNow()), [epoch])

  return dark
}
