// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useEffect } from 'react'

import { translateNow } from '@/i18n'
import { notify } from '@/store/notifications'

// GPU acceleration is disabled under remote display (RDP/VNC/etc) to avoid
// flicker. Surfaces once per launch as a persistent toast through the shared
// notification stack — was a hand-rolled second top-center card at these same
// exact fixed coordinates, which could overlap a real toast.
export function RemoteDisplayBanner() {
  useEffect(() => {
    void window.hermesDesktop?.getRemoteDisplayReason?.().then(reason => {
      if (reason) {
        notify({
          durationMs: 0,
          kind: 'info',
          message: translateNow('remoteDisplayBanner.message', reason),
          placement: 'default'
        })
      }
    })
  }, [])

  return null
}
