// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * remote-url.ts
 *
 * Renderer-side twin of the scheme coercion in
 * electron/connection-config.ts `normalizeRemoteBaseUrl()`. Users routinely
 * paste scheme-less "host:port" (a Tailscale IP, a LAN hostname) into the
 * remote-gateway URL field; without coercion the renderer's `^https?://`
 * probe gates never fire and the field just sits idle with no feedback.
 *
 * Keep the opt-out regex in sync with the electron side: only a real
 * `scheme://` prefix skips the http:// prepend, so explicit non-http schemes
 * (ws://, ftp://) still reach main-process validation and get a clear error.
 */
export function coerceRemoteUrlScheme(rawUrl: string): string {
  const value = String(rawUrl || '').trim()

  if (!value || /^[a-z][a-z0-9+.-]*:\/\//i.test(value)) {
    return value
  }

  return `http://${value}`
}
