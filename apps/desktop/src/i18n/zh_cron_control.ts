// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { CronControlCopy } from './types_cron_control'

export const zhCronControl: CronControlCopy = {
  stop: '停止',
  stopping: '正在停止…',
  stopped: '运行已取消',
  finishedFirst: '运行在停止前已结束',
  nothingToStop: '没有正在进行的运行',
  failedStop: '无法停止运行',
  lastCancelled: (reason: string) => (reason ? `上次运行已取消: ${reason}` : '上次运行已取消'),
  catchUpLabel: '错过的运行',
  catchUpHint: 'Hermes 未运行期间错过的运行如何处理。',
  catchUpChoices: {
    default: '使用默认设置',
    run: '恢复后补跑一次',
    skip: '跳过'
  }
}
