// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Reshow clock for the local-models campaign tips in the rotation (today: the
 * engine update). A tip ignored (timed out) may return, but on a much longer
 * clock than the rotation's: it is the same message twice, not a tour moving on.
 */

export const LOCAL_TIP_RESHOW_MS = 7 * 24 * 60 * 60_000

/** Due = never shown, or shown long enough ago that repeating it reads as a
 *  reminder rather than a nag. Retirement is the caller's ledger, not ours. */
export function localTipDue(now: number, shownAt: number | undefined): boolean {
  return shownAt === undefined || now - shownAt >= LOCAL_TIP_RESHOW_MS
}
