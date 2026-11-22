// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/** Cadences for the floating-pet `pet.info` refresh timer.

Event-capable backends rely on `pet.changed` for live updates but still need
a slow backstop: the gateway seeds the pet signature silently at boot and only
broadcasts when it *moves*, and the one-shot connect pull can race a still-
warming backend (`pet.info` fail-opens to `enabled:false`).
*/

export const PET_POLL_MS = 3_000
export const PET_ACTIVE_REFRESH_MS = 15_000
/** Slow safety net when `pet.changed` is available. */
export const PET_BACKSTOP_MS = 15_000
/** Cold-start retries after the first connect pull (fail-open recovery). */
export const PET_STARTUP_RETRY_MS = [1_000, 3_000, 8_000] as const

export function petInfoPollIntervalMs(changeEventsAvailable: boolean, active: boolean): number {
  if (changeEventsAvailable) {
    return PET_BACKSTOP_MS
  }

  return active ? PET_ACTIVE_REFRESH_MS : PET_POLL_MS
}
