// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { applySessionControlUpdate } from '@/store/session-control'

import type { GatewayEventContext } from './types'

export function handleControlEvent(ctx: GatewayEventContext): boolean {
  const { event, payload, sessionId } = ctx

  if (event.type !== 'session.control.update') {
    return false
  }

  if (!sessionId) {
    return true
  }

  const control = payload && typeof payload === 'object' ? (payload as { control?: unknown }).control : undefined
  applySessionControlUpdate(sessionId, control)

  return true
}
