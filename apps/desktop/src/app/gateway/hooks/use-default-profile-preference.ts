// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useEffect } from 'react'

import { refreshDefaultProfile, subscribeDefaultProfile } from '@/store/default-profile'

export function useDefaultProfilePreference(): void {
  useEffect(() => {
    const unsubscribe = subscribeDefaultProfile()
    // A failed read leaves the last known preference intact. It must never
    // prevent gateway boot, and the next boot/menu refresh can retry it.
    void refreshDefaultProfile().catch(() => undefined)

    return unsubscribe
  }, [])
}
