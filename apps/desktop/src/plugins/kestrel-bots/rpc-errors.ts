// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/** JSON-RPC method-not-found (`tui_gateway/rpc_dispatch.py`): the backend predates the call.
 *  The message match covers errors that lost their frame across the IPC bridge. */
export function rpcMethodMissing(error: unknown): boolean {
  const code = error && typeof error === 'object' ? (error as { code?: unknown }).code : undefined

  if (typeof code === 'number') {
    return code === -32601
  }

  return /method not found|-32601|unknown method|no such method/i.test(error instanceof Error ? error.message : String(error))
}
