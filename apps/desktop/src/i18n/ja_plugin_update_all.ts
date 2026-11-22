// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { PluginUpdateAllTranslations } from './types_plugin_update'

/** Plugins tab: "Update all" and the auto-update switch. */
export const jaPluginUpdateAll: PluginUpdateAllTranslations = {
  updateAll: 'すべて更新',
  updatingAll: '更新中…',
  updateAllTip: 'インストール済みのすべてのプラグインを確認し、確認不要な更新を適用します',
  updateAllDone: (updated: number, review: number, failed: number) =>
    `${updated} 件更新` + (review ? `、${review} 件は確認が必要` : '') + (failed ? `、${failed} 件失敗` : ''),
  updateAllNone: 'すべてのプラグインは最新です',
  updateAllFailed: 'プラグインを更新できませんでした',
  autoUpdate: '自動更新',
  autoUpdateTip: (hours: number) =>
    `ゲートウェイの確認時（${hours} 時間ごと）にプラグインの更新を自動で適用します。更新されたコードは新しいセッションで読み込まれます。`,
  autoUpdateFailed: 'プラグインの自動更新を変更できませんでした'
}
