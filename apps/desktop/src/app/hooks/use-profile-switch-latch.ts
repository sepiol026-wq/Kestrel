// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useState } from 'react'

interface QueryStamps {
  dataUpdatedAt: number
  errorUpdatedAt?: number
}

/**
 * Freshness latch for a React Query record across a gateway-profile switch.
 * `arm()` (call it from `useOnProfileSwitch`) remembers the stamps the query
 * carries for the OUTGOING profile; `pending` stays true until the query
 * resettles for the new profile — a fresh success bumps `dataUpdatedAt`, a
 * fresh failure bumps `errorUpdatedAt` (when supplied). The timestamps are
 * the freshness proof because React Query structurally shares results, so a
 * profile with identical settings reuses the very same object reference.
 */
export function useProfileSwitchLatch({ dataUpdatedAt, errorUpdatedAt }: QueryStamps): {
  arm: () => void
  pending: boolean
} {
  const [stale, setStale] = useState<null | QueryStamps>(null)

  return {
    arm: () => setStale({ dataUpdatedAt, errorUpdatedAt }),
    pending: stale !== null && dataUpdatedAt === stale.dataUpdatedAt && errorUpdatedAt === stale.errorUpdatedAt
  }
}
