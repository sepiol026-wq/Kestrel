// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { CronControlCopy } from './types_cron_control'

export const zhHantCronControl: CronControlCopy = {
  stop: '停止',
  stopping: '正在停止…',
  stopped: '執行已取消',
  finishedFirst: '執行在停止前已結束',
  nothingToStop: '沒有進行中的執行',
  failedStop: '無法停止執行',
  lastCancelled: (reason: string) => (reason ? `上次執行已取消: ${reason}` : '上次執行已取消'),
  catchUpLabel: '錯過的執行',
  catchUpHint: 'Hermes 未執行期間錯過的執行如何處理。',
  catchUpChoices: {
    default: '使用預設設定',
    run: '恢復後補跑一次',
    skip: '略過'
  }
}
