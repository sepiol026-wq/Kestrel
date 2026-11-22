// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Session-scoped memory of an explicit `/wake off`.
//
// The gateway auto-arms the "Hey Hermes" listener on every `gateway.ready`
// (see createGatewayEventHandler.ts). When the user explicitly disables the
// listener with `/wake off`, a reconnect must NOT silently re-arm it — this
// module-level flag records that intent for the lifetime of the process.
// `/wake on` clears it. Deliberately not persisted: config (`wake_word.*`)
// remains the durable on/off switch; this is only per-session steering.
let wakeUserDisabled = false

export const isWakeUserDisabled = (): boolean => wakeUserDisabled

export const setWakeUserDisabled = (disabled: boolean): void => {
  wakeUserDisabled = disabled
}
