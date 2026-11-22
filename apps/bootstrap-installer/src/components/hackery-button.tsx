// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { Loader2 } from 'lucide-react'

import { cn } from '../lib/utils'

/*
 * HackeryButton — the onboarding "Begin" CTA, ported standalone.
 *
 * Bracketed [ LABEL ], mono/uppercase, primary accent on a --stroke-nous hairline.
 * Lifted from apps/desktop's desktop-onboarding-overlay.tsx (sans the exit-scramble
 * choreography, which is overlay-specific). Self-contained: cn + lucide only.
 */
export function HackeryButton({
  className,
  label,
  loading,
  ...props
}: Omit<React.ComponentProps<'button'>, 'children'> & { label: React.ReactNode; loading?: boolean }) {
  return (
    <button
      {...props}
      className={cn(
        'group inline-flex cursor-pointer items-center gap-2 rounded-md border border-(--stroke-nous) px-6 py-2.5',
        'font-mono text-xs font-semibold uppercase text-primary',
        'transition-all duration-150 hover:border-primary/60 hover:bg-primary/[0.06]',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      type="button"
    >
      <span className="text-primary/40 transition-colors group-hover:text-primary">[</span>
      {loading ? <Loader2 className="size-3 animate-spin" /> : null}
      <span className="-mr-[0.25em] pl-[0.25em] tracking-[0.25em]">{label}</span>
      <span className="text-primary/40 transition-colors group-hover:text-primary">]</span>
    </button>
  )
}
