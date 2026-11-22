// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { cn } from '@/lib/utils'

interface StableTextProps {
  'aria-hidden'?: boolean
  children: string
  className?: string
}

/**
 * Renders text as a row of 1ch-wide cells so individual characters can't
 * shift the layout as they change (e.g. digits in a ticking timer).
 * Works with any proportional font — no need for font-mono.
 */
export function StableText({ 'aria-hidden': ariaHidden, children, className }: StableTextProps) {
  return (
    <span aria-hidden={ariaHidden} className={cn('inline-flex', className)}>
      {children.split('').map((char, i) => (
        <span className="inline-block w-[1ch] text-center" key={i}>
          {char}
        </span>
      ))}
    </span>
  )
}
