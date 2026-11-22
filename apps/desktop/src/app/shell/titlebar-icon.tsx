// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { Codicon } from '@/components/ui/codicon'
import { cn } from '@/lib/utils'

import { titlebarIconSizeCss } from './titlebar'

/** Titlebar-cluster glyph — 13.9px inline (see titlebarIconSizeCss). */
export function TitlebarIcon({
  className,
  name,
  size = titlebarIconSizeCss(),
  spinning
}: {
  className?: string
  name: string
  size?: number | string
  spinning?: boolean
}) {
  return <Codicon className={cn('leading-none', className)} name={name} size={size} spinning={spinning} />
}
