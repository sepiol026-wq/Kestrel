// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// The sign-in and handoff reads are long-polls: the backend holds each request until something
// changes. An older backend answers at once, so a loop never asks again sooner than this after its
// previous ask started.
export const LONG_POLL_MIN_GAP_MS = 2000

export function pause(ms: number): Promise<void> {
  return new Promise(resolve => window.setTimeout(resolve, ms))
}

/** Wait out the rest of the minimum gap after an ask that started at `askedAt` (`Date.now()`). */
export function restOfLongPollGap(askedAt: number): Promise<void> {
  return pause(Math.max(0, LONG_POLL_MIN_GAP_MS - (Date.now() - askedAt)))
}
