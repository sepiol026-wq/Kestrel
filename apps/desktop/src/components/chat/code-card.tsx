// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import * as React from 'react'

import { Codicon, type CodiconProps } from '@/components/ui/codicon'
import { cn } from '@/lib/utils'

/**
 * Rounded surface for fenced code (and any equivalent: diffs, raw payloads,
 * etc.) sized for the conversation column. Background only — no border, no
 * header, no language label — so a code block reads as a tinted slab of the
 * reply rather than an attached artifact.
 */
function CodeCard({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'group/code relative min-w-0 max-w-full overflow-hidden rounded-[0.625rem] bg-(--ui-bg-editor) [--expandable-fade-from:var(--ui-bg-editor)] text-[length:var(--conversation-tool-font-size)] text-muted-foreground',
        className
      )}
      data-slot="code-card"
      {...props}
    />
  )
}

function CodeCardIcon({ className, ...props }: CodiconProps) {
  return (
    <Codicon
      className={cn('shrink-0 text-[0.875rem] leading-none text-muted-foreground', className)}
      data-slot="code-card-icon"
      {...props}
    />
  )
}

function CodeCardBody({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'font-mono text-[length:calc(0.7rem*var(--conversation-text-scale,1))] leading-relaxed text-foreground/90 [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:scrollbar-overlay [&_pre]:bg-transparent! [&_pre]:px-2 [&_pre]:py-1.5 [&_pre]:font-mono [&_pre]:leading-relaxed',
        className
      )}
      data-slot="code-card-body"
      {...props}
    />
  )
}

export { CodeCard, CodeCardBody, CodeCardIcon }
