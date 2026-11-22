// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { memo, useMemo } from 'react'

import { ansiColorClass, hasAnsiCodes, parseAnsi } from '@/lib/ansi'
import { cn } from '@/lib/utils'

interface AnsiTextProps {
  text: string
  className?: string
}

/** Renders text with embedded ANSI SGR codes as colored / bold spans. Falls
 *  back to a plain string node when no codes are present so the parser cost
 *  is paid only when there's something to colorize. */
export const AnsiText = memo(({ className, text }: AnsiTextProps) => {
  const segments = useMemo(() => (hasAnsiCodes(text) ? parseAnsi(text) : null), [text])

  if (!segments) {
    return <span className={className}>{text}</span>
  }

  return (
    <span className={className}>
      {segments.map((segment, index) => (
        <span
          className={cn(segment.bold && 'font-semibold', segment.fg && ansiColorClass(segment.fg))}
          key={`ansi-${index}`}
        >
          {segment.text}
        </span>
      ))}
    </span>
  )
})
