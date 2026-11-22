// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Desktop log line formatting shared by every desktop log surface:
 * `desktop.log`, the in-app "RECENT LOGS" view, and crash forensics.
 *
 * The stamp is local time in the `YYYY-MM-DD HH:MM:SS,mmm` shape of Python's
 * default `asctime` (agent.log, gui.log, errors.log), so every file in `logs/`
 * reads on one clock and `hermes logs desktop --since` can parse these lines.
 * See #84405 for why lines carry a stamp at all.
 */

const pad = (value: number, width = 2) => String(value).padStart(width, '0')

/** `2026-09-28 13:18:46,062` in the machine's local time zone. */
export function formatLogStamp(date: Date): string {
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`

  return `${day} ${time},${pad(date.getMilliseconds(), 3)}`
}

/**
 * Format one desktop log line with a local-time stamp.
 *
 * `stamp` defaults to now; callers that batch multiple lines (a single
 * stdout chunk) pass one shared stamp so the group reads as one event.
 */
export function formatDesktopLogLine(text: string, stamp = formatLogStamp(new Date())): string {
  return `${stamp} [hermes] ${text}`
}
