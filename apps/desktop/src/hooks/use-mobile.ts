// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useMediaQuery } from './use-media-query'

/** Narrower than this and the sidebar stops being a docked column: it renders
 *  as a floating Sheet over the content instead (components/ui/sidebar.tsx).
 *  Anything that sizes a window around a docked sidebar has to clear it. */
const DOCKED_SIDEBAR_MIN_PX = 768

export const useIsMobile = () => useMediaQuery(`(max-width: ${(DOCKED_SIDEBAR_MIN_PX - 1) / 16}rem)`)
