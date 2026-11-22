// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describeRpcError } from '../app/userMessages.js'
import { t } from '../i18n/runtime.js'

export type RpcResult = Record<string, any>

export const asRpcResult = <T extends RpcResult = RpcResult>(value: unknown): T | null =>
  !value || typeof value !== 'object' || Array.isArray(value) ? null : (value as T)

// Every `error: …` line the TUI prints for a failed RPC goes through here, so
// transport-level failures (backend down, stale session id, version skew,
// timeouts) read as what happened + what to do instead of the wire text.
export const rpcErrorMessage = (err: unknown) =>
  err instanceof Error && err.message
    ? describeRpcError(err)
    : typeof err === 'string' && err.trim()
      ? describeRpcError(err)
      : t('rpc.requestFailed')
