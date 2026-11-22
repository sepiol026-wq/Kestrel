// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

/** Block wheel until ⌘/Ctrl so map embeds don't hijack transcript scroll. */
export function ScrollGate() {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const sync = (event: KeyboardEvent) => setActive(event.metaKey || event.ctrlKey)
    const clear = () => setActive(false)

    window.addEventListener('keydown', sync)
    window.addEventListener('keyup', sync)
    window.addEventListener('blur', clear)

    return () => {
      window.removeEventListener('keydown', sync)
      window.removeEventListener('keyup', sync)
      window.removeEventListener('blur', clear)
    }
  }, [])

  return (
    <div className={cn('group/gate absolute inset-0', active ? 'pointer-events-none' : 'pointer-events-auto')}>
      <span className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-black/55 px-1.5 py-0.5 text-[0.625rem] font-medium text-white opacity-0 transition-opacity group-hover/embed:opacity-100">
        Hold ⌘ to zoom
      </span>
    </div>
  )
}
