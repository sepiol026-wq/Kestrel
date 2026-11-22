// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { InstallPhase } from '@hermes/shared'

/** Copy for the desktop catalog-install card (`manage_catalog`) and its Advanced dialog. */
export interface CatalogInstallTranslations {
  preparing: string
  install: string
  advanced: string
  skip: string
  installing: string
  installed: string
  notInstalled: string
  failed: string
  showNames: string
  hideNames: string
  skill: (name: string) => string
  kind: { plugin: string; skill: string }
  tier: { official: string; verified: string; community: string }
  targetProfile: (profile: string) => string
  sendFailed: string
  commitLabel: string
  subdirLabel: string
  securityHeading: string
  scan: { passed: string; warnings: string; failed: string }
  requirementsLabel: string
  requiresHermes: (range: string) => string
  envVar: (name: string) => string
  credentialsHeading: string
  phase: Record<InstallPhase, string>
  serverNotConnected: (server: string, reason: string) => string
  notEnabled: string
  missingEnv: (names: string) => string
  alreadyInstalled: string
}
