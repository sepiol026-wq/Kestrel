// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

// Shared raw-log viewer: no bg, hairline border, tight padding, small mono.
// One style everywhere we surface logs. Pass a max-h-* via className.
// Selectable by default — logs exist to be read and copied.
export function LogView({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'overflow-auto rounded-lg border border-(--ui-stroke-tertiary) px-2.5 py-1.5 font-mono text-[0.6875rem] leading-[1.5] whitespace-pre-wrap break-words text-(--ui-text-tertiary)',
        className
      )}
      data-selectable-text="true"
      {...props}
    />
  )
}
