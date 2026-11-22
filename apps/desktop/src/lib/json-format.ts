// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

export type FormatJsonResult = { ok: true; text: string } | { ok: false; error: string }

export function tryFormatJson(raw: string): FormatJsonResult {
  const text = raw.trim()

  if (!text) {
    return { ok: true, text: raw }
  }

  try {
    return { ok: true, text: JSON.stringify(JSON.parse(text) as unknown, null, 2) }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}
