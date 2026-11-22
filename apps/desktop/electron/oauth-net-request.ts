// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Helpers for Electron net.request calls that ride the OAuth session partition.
 *
 * Electron's ClientRequest forbids app-set restricted headers such as
 * Content-Length. Let Chromium frame the body itself; only set the JSON content
 * type here.
 */

function serializeJsonBody(body) {
  return body === undefined ? undefined : Buffer.from(JSON.stringify(body))
}

function setJsonRequestHeaders(request) {
  request.setHeader('Content-Type', 'application/json')
}

export { serializeJsonBody, setJsonRequestHeaders }
