// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { cn } from '@/lib/utils'

import { formatElapsed } from './activity-timer'
import { StableText } from './stable-text'

interface ActivityTimerTextProps {
  'aria-hidden'?: boolean
  seconds: number
  className?: string
}

export function ActivityTimerText({ 'aria-hidden': ariaHidden, seconds, className }: ActivityTimerTextProps) {
  return (
    <StableText
      aria-hidden={ariaHidden}
      className={cn(
        // Tinted with --dt-midground (very low alpha) so the timer reads
        // as part of the same "live signal" cluster as the dither block /
        // arc-border / working-session dot, instead of being neutral chrome.
        'shrink-0 text-[0.56rem] leading-none tracking-[0.02em] text-midground/55',
        className
      )}
    >
      {formatElapsed(seconds)}
    </StableText>
  )
}
