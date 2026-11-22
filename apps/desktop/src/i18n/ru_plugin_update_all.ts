// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { PluginUpdateAllTranslations } from './types_plugin_update'

/** Plugins tab: "Update all" and the auto-update switch. */
export const ruPluginUpdateAll: PluginUpdateAllTranslations = {
  updateAll: 'Обновить все',
  updatingAll: 'Обновление…',
  updateAllTip: 'Проверить все установленные плагины и применить обновления, не требующие проверки',
  updateAllDone: (updated: number, review: number, failed: number) =>
    `Обновлено: ${updated}` +
    (review ? `, требуют проверки: ${review}` : '') +
    (failed ? `, с ошибкой: ${failed}` : ''),
  updateAllNone: 'Все плагины в актуальном состоянии',
  updateAllFailed: 'Не удалось обновить плагины',
  autoUpdate: 'Автообновление',
  autoUpdateTip: (hours: number) =>
    `Автоматически применять обновления плагинов при проверке шлюзом (каждые ${hours} ч). Новый код загружается в новых сессиях.`,
  autoUpdateFailed: 'Не удалось изменить автообновление плагинов'
}
