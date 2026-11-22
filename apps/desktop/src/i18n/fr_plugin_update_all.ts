// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { PluginUpdateAllTranslations } from './types_plugin_update'

/** Plugins tab: "Update all" and the auto-update switch. */
export const frPluginUpdateAll: PluginUpdateAllTranslations = {
  updateAll: 'Tout mettre à jour',
  updatingAll: 'Mise à jour…',
  updateAllTip: 'Vérifier tous les plugins installés et appliquer les mises à jour qui ne demandent pas de revue',
  updateAllDone: (updated: number, review: number, failed: number) =>
    `${updated} mis à jour` + (review ? `, ${review} à examiner` : '') + (failed ? `, ${failed} en échec` : ''),
  updateAllNone: 'Tous les plugins sont à jour',
  updateAllFailed: 'Impossible de mettre à jour les plugins',
  autoUpdate: 'Mise à jour automatique',
  autoUpdateTip: (hours: number) =>
    `Appliquer automatiquement les mises à jour des plugins lors de la vérification du gateway (toutes les ${hours} h). Le nouveau code se charge dans les nouvelles sessions.`,
  autoUpdateFailed: 'Impossible de modifier la mise à jour automatique des plugins'
}
