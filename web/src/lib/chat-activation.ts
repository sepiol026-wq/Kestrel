// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Chat PTY activation latch.
 *
 * The dashboard keeps `ChatPage` mounted persistently (just hidden with CSS)
 * on every route so the embedded chat PTY survives tab switches. The downside
 * is that the PTY-connect effect would otherwise open `/api/pty` — which spawns
 * the whole TUI + agent bootstrap (on a fresh checkout this prints
 * `Installing TUI dependencies…` and installs them) — the moment the
 * dashboard loads *any* page, even one the user never navigates the chat into.
 *
 * The fix is to only open the PTY once the chat tab has actually been active,
 * while keeping activation **sticky** so the PTY still persists across later
 * tab switches. This helper computes that latch: once `true`, it stays `true`.
 */
export function latchChatActivation(previous: boolean, isActive: boolean): boolean {
  return previous || isActive;
}
