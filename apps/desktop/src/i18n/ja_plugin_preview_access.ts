// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { PluginPreviewAccessTranslations } from './types_plugin_preview_access'

/** Copy for the preview-script consent prompt and the per-plugin grant list (Capabilities ▸ Plugins). */
export const jaPluginPreviewAccess: PluginPreviewAccessTranslations = {
  previewScriptPromptTitle: (plugin: string) => `${plugin} にこのページでスクリプトの実行を許可しますか？`,
  previewScriptPromptBody: (plugin: string, origin: string) =>
    `${plugin} がプレビューブラウザーの ${origin} で JavaScript を実行しようとしています。`,
  previewScriptPromptRisk: 'スクリプトはそのサイトのすべてを読み取り・変更できます。ログイン中のアカウントのページも含まれます。',
  previewScriptPromptRevokeHint: 'このサイトにのみ適用されます。スキルとツール ▸ プラグインでいつでも取り消せます。',
  previewScriptAllow: 'このサイトで許可',
  previewScriptDeny: '許可しない',
  previewScriptAccessLabel: 'ページスクリプト',
  previewScriptAccessNone: 'ページでスクリプトを実行する前に確認します',
  previewScriptRevoke: (origin: string) => `${origin} へのアクセスを取り消す`,
  previewScriptRevoked: (plugin: string, origin: string) => `${plugin} は ${origin} でスクリプトを実行できなくなりました。`,
  previewScriptRevokeUnsaved: (plugin: string, origin: string) =>
    `変更を保存できなかったため、Hermes を再起動するまでの一時的な設定です。現在 ${plugin} は ${origin} でブロックされています。`
}
