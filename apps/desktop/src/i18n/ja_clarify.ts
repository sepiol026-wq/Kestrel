// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { ClarifyCopy } from './types_clarify'

export const jaClarify: Partial<ClarifyCopy> = {
  notReady: '明確化リクエストはまだ準備できていません',
  gatewayDisconnected: 'Hermes ゲートウェイが接続されていません',
  sendFailed: '明確化応答を送信できませんでした',
  loadingQuestion: '質問を読み込み中…',
  other: 'その他（回答を入力）',
  placeholder: '回答を入力…',
  skip: 'スキップ',
  skipped: 'スキップ済み',
  noAnswer: '回答なし',
  confirmAndContinueLabel: '確定して続行',
  singleSelectHint: '1つ選ぶ',
  multiSelectHint: '該当するものをすべて選択',
  oneQuestion: '1問',
  questionProgress: (answered, total) => `${total}問中${answered}問回答済み`,
  notDelivered:
    'この質問はアプリに届かなかったため、ここでは回答できません。停止を押してターンを終了し、チャットで返信してください。'
}
