// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import './wake-indicator.css'

import { useEffect, useState } from 'react'

import type { WakeIndicatorState } from '@/lib/wake-indicator'

export function WakeIndicatorApp() {
  const [state, setState] = useState<WakeIndicatorState>('hidden')

  useEffect(() => {
    const api = window.hermesDesktop?.wakeIndicator
    let mounted = true
    let receivedLiveState = false

    const unsubscribe = api?.onState(next => {
      if (mounted) {
        receivedLiveState = true
        setState(next)
      }
    })

    void api
      ?.getState()
      .then(next => {
        if (mounted && !receivedLiveState) {
          setState(next)
        }
      })
      .catch(() => undefined)

    return () => {
      mounted = false
      unsubscribe?.()
    }
  }, [])

  return (
    <main aria-hidden className="wake-indicator-surface" data-state={state}>
      <div className="wake-indicator-light" />
    </main>
  )
}
