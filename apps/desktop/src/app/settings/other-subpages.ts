// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { hostHas } from '@/lib/host-capabilities'

import type { SettingsSubpage } from './subpages'

// Gateway tasks and search rows that only native Desktop can act on; the Webapp's
// Gateways page is just its serving host (see WebappGatewaySettings).
export const nativeHostOnly = () => hostHas('gatewayManagement')

// Pages with separate tasks expose content-only subpages. Billing keeps its
// existing capability-gated bview=overview|plans flow rather than adding a
// second route parameter that could disagree with a pending financial action.
export const OTHER_SUBPAGES: Record<string, SettingsSubpage[]> = {
  gateway: [
    { id: 'connection', labelKey: 'gatewayConnection', available: nativeHostOnly },
    { id: 'devices', labelKey: 'gatewayDevices', available: nativeHostOnly },
    { id: 'managed-updates', labelKey: 'gatewayManagedUpdates', available: nativeHostOnly }
  ],
  keybinds: [
    { id: 'shortcuts', labelKey: 'keyboardShortcuts' },
    { id: 'hud-gesture', labelKey: 'hudGesture' },
    { id: 'screen-capture', labelKey: 'screenCapture' }
  ],
  notifications: [
    { id: 'alerts', labelKey: 'notificationAlerts' },
    { id: 'sounds', labelKey: 'notificationSounds' }
  ],
  sessions: [
    { id: 'archived', labelKey: 'archivedSessions' },
    { id: 'default-directory', labelKey: 'defaultDirectory' }
  ],
  vault: [
    { id: 'credentials', labelKey: 'vaultCredentials' },
    { id: 'sources', labelKey: 'vaultSources' }
  ],
  about: [
    { id: 'updates', labelKey: 'appUpdates' },
    { id: 'uninstall', labelKey: 'uninstall' }
  ]
}
