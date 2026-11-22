// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

export interface ScreenshotStatus {
  enabled: boolean
  state: 'disabled' | 'starting' | 'ready' | 'input-permission' | 'screen-permission' | 'unavailable'
}

export interface ScreenshotWindow {
  windowId: number
  width: number
  height: number
}

export type ScreenshotResult =
  { ok: true; png: Uint8Array } | { ok: false; reason: 'expired' | 'screen-permission' | 'unavailable' }

export interface ScreenshotApi {
  getSettings(): Promise<ScreenshotStatus>
  setEnabled(enabled: boolean): Promise<ScreenshotStatus>
  openPermissionSettings(kind: 'input' | 'screen'): Promise<void>
  onStatus(callback: (status: ScreenshotStatus) => void): () => void
  onRequest(callback: (requestId: string) => void): () => void
  capture(requestId: string): Promise<ScreenshotResult>
}
