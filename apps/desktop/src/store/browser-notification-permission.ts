// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * The Webapp's browser notification permission as one store, so every control
 * that can ask (the Allow button, Send test notification) and every row that
 * shows the answer agree. The user can also change it in the browser's site
 * settings, so a view refreshes it when it opens.
 */

import { atom } from 'nanostores'

import {
  browserNotificationPermission,
  type BrowserNotificationPermission,
  requestBrowserNotificationPermission
} from '@/lib/browser-notifications'

export const $browserNotificationPermission = atom<BrowserNotificationPermission>(browserNotificationPermission())

export function refreshBrowserNotificationPermission(): void {
  $browserNotificationPermission.set(browserNotificationPermission())
}

/** Call from a click handler only. */
export async function askBrowserNotificationPermission(): Promise<BrowserNotificationPermission> {
  const permission = await requestBrowserNotificationPermission()

  $browserNotificationPermission.set(permission)

  return permission
}
