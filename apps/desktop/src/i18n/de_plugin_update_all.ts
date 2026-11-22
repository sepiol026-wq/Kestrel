// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { PluginUpdateAllTranslations } from './types_plugin_update'

/** Plugins tab: "Update all" and the auto-update switch. */
export const dePluginUpdateAll: PluginUpdateAllTranslations = {
  updateAll: 'Alle aktualisieren',
  updatingAll: 'Wird aktualisiert…',
  updateAllTip: 'Alle installierten Plugins prüfen und Updates anwenden, die keine Prüfung brauchen',
  updateAllDone: (updated: number, review: number, failed: number) =>
    `${updated} aktualisiert` + (review ? `, ${review} zu prüfen` : '') + (failed ? `, ${failed} fehlgeschlagen` : ''),
  updateAllNone: 'Alle Plugins sind aktuell',
  updateAllFailed: 'Plugins konnten nicht aktualisiert werden',
  autoUpdate: 'Automatisch aktualisieren',
  autoUpdateTip: (hours: number) =>
    `Plugin-Updates automatisch anwenden, wenn das Gateway prüft (alle ${hours} h). Neuer Code wird in neuen Sitzungen geladen.`,
  autoUpdateFailed: 'Automatische Plugin-Updates konnten nicht geändert werden'
}
