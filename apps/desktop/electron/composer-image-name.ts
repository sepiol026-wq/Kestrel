// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Filename stamping for pasted composer images (composer-images/).
 *
 * The timestamp embedded in a composer image filename must be the user's
 * LOCAL wall-clock time: these files are browsed and sorted by humans
 * alongside their filesystem mtimes, which the OS displays in local time.
 * Rendering the stamp with Date.toISOString() writes UTC into the filename,
 * so for anyone off UTC the name disagrees with the file's mtime by the zone
 * offset (issue #96403 — e.g. 8 hours off for UTC+8 users).
 *
 * Machine-facing artifacts (run logs, emergency backups) intentionally keep
 * UTC stamps; this helper is for the user-facing composer-images/ directory
 * only.
 */

function pad(value: number, width: number): string {
  return String(value).padStart(width, '0')
}

/**
 * Format `date` as `YYYY-MM-DD_HH-MM-SS-mmm` in LOCAL time — the same shape
 * the previous toISOString()-based stamp produced, but in the user's timezone.
 */
export function composerImageTimestamp(date: Date = new Date()): string {
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1, 2)}-${pad(date.getDate(), 2)}` +
    `_${pad(date.getHours(), 2)}-${pad(date.getMinutes(), 2)}-${pad(date.getSeconds(), 2)}` +
    `-${pad(date.getMilliseconds(), 3)}`
  )
}
