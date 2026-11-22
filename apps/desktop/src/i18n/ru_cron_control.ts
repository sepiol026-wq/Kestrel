// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { CronControlCopy } from './types_cron_control'

export const ruCronControl: CronControlCopy = {
  stop: 'Остановить',
  stopping: 'Остановка…',
  stopped: 'Запуск отменён',
  finishedFirst: 'Запуск завершился до остановки',
  nothingToStop: 'Нет активного запуска',
  failedStop: 'Не удалось остановить запуск',
  lastCancelled: (reason: string) => (reason ? `Последний запуск отменён: ${reason}` : 'Последний запуск отменён'),
  catchUpLabel: 'Пропущенные запуски',
  catchUpHint: 'Что делать с запусками, пропущенными, пока Hermes не работал.',
  catchUpChoices: {
    default: 'По умолчанию',
    run: 'Запустить один раз после возврата',
    skip: 'Пропустить'
  }
}
