// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { ReactNode } from 'react'

import { Codicon } from '@/components/ui/codicon'
import { cn } from '@/lib/utils'

import { StatusRow } from './status-row'

interface StatusControlRowProps {
  children: ReactNode
  className?: string
  icon?: string
}

/** Text/detail rows share the task icon column without decorating supporting copy. */
export function StatusControlRow({ children, className, icon }: StatusControlRowProps) {
  return (
    <StatusRow
      className={cn('status-control-row text-[0.7rem] text-muted-foreground/80', className)}
      leading={icon ? <Codicon className="text-muted-foreground/70" name={icon} size="0.8rem" /> : undefined}
    >
      {children}
    </StatusRow>
  )
}
