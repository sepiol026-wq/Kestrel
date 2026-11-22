// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/** Electron flattens console arguments, so keep wake fields in the message itself.
 * The renderer console capture persists only this warning namespace to desktop.log. */
export function logBotWake(
  message: 'hydration timed out' | 'hydration timed out, retrying',
  details: Record<string, boolean | number | string>
): void {
  console.warn(`[bot-wake] ${message} ${JSON.stringify(details)}`)
}
