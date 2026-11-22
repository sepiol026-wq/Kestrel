// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { TITLEBAR_HEIGHT, TOUCH_TITLEBAR_HEIGHT } from '@/app/shell/titlebar'
import { useMediaQuery } from '@/hooks/use-media-query'
import { hostHas } from '@/lib/host-capabilities'
import { TOUCH_POINTER_QUERY } from '@/lib/touch-interaction'

/** Browser touch chrome needs a 44px band, not Electron's compact 34px band. */
export function useTouchTitlebar(): boolean {
  const touch = useMediaQuery(TOUCH_POINTER_QUERY)

  return hostHas('touchSizedControls') && touch
}

export function useTitlebarHeight(): number {
  return useTouchTitlebar() ? TOUCH_TITLEBAR_HEIGHT : TITLEBAR_HEIGHT
}
