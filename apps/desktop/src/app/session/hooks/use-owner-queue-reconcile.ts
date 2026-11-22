// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useEffect } from 'react'

import { watchOwnerQueues } from '@/store/owner-queue-reconcile'

/** Re-read the owner's queue of chats holding owner work on every edge into an open gateway. */
export function useOwnerQueueReconcile(requestGateway: Parameters<typeof watchOwnerQueues>[0]): void {
  useEffect(() => watchOwnerQueues(requestGateway), [requestGateway])
}
