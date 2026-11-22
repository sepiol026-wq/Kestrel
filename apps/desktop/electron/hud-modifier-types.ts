// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

export interface HudModifierStatus {
  enabled: boolean
  state: 'disabled' | 'starting' | 'ready' | 'input-permission' | 'unavailable'
  reason?: 'missing-helper' | 'unsupported-session'
}

export interface HudModifierApi {
  getSettings: () => Promise<HudModifierStatus>
  setEnabled: (enabled: boolean) => Promise<HudModifierStatus>
  openPermissionSettings: () => Promise<void>
  onStatus: (callback: (status: HudModifierStatus) => void) => () => void
}
