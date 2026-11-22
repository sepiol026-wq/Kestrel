// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Settings > About > Uninstall; `Translations.settings.uninstallSection`.
export interface UninstallSectionTranslations {
  dangerZone: string
  checkingInstalled: string
  uninstallHermes: string
  managedBody: string
  dataKept: (path: string) => string
  openAppsSettings: string
  chooseHowMuch: string
  confirmUninstall: string
  confirmBody: (what: string) => string
  appLabel: string
  couldNotStart: string
  uninstalling: string
  yesUninstall: string
  options: {
    gui: { title: string; description: string; consequence: string }
    lite: { title: string; description: string; consequence: string }
    full: { title: string; description: string; consequence: string }
  }
}
