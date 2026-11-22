// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Admission for URLs handed up by the preview guest preload
// (electron/preview-guest-preload.ts, `preview-open-external` channel).
//
// A guest page chose this URL, not the user typing it, so the scheme set is
// strictly the web subset of what main's `openExternalUrl` accepts. `file:`
// stays out on purpose: main's opener does open local files, but that
// capability belongs to host-driven surfaces (the artifacts panel), and an
// untrusted preview page must never reach `shell.openPath` through us.

export const PREVIEW_EXTERNAL_CHANNEL = 'preview-open-external'

export function admitPreviewExternalUrl(rawUrl: string): boolean {
  const raw = String(rawUrl ?? '').trim()

  if (!raw) {
    return false
  }

  try {
    const { protocol } = new URL(raw)

    return protocol === 'https:' || protocol === 'http:'
  } catch {
    return false
  }
}
