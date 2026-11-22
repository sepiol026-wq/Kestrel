// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { ComponentProps } from 'react'

import { Loader } from '@/components/ui/loader'
import { cn } from '@/lib/utils'

interface PageLoaderProps extends Omit<ComponentProps<'div'>, 'children'> {
  label?: string
}

export function PageLoader({
  'aria-label': ariaLabel,
  className,
  label = 'Loading',
  role = 'status',
  ...props
}: PageLoaderProps) {
  return (
    <div
      {...props}
      aria-label={ariaLabel ?? label}
      className={cn('grid h-full place-items-center', className)}
      role={role}
    >
      <Loader
        aria-hidden="true"
        className="size-10 text-primary/70"
        pathSteps={220}
        role="presentation"
        strokeScale={0.72}
        type="rose-curve"
      />
    </div>
  )
}
