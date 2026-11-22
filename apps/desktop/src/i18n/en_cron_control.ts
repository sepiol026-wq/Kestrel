// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { CronControlCopy } from './types_cron_control'

export const enCronControl: CronControlCopy = {
  stop: 'Stop',
  stopping: 'Stopping…',
  stopped: 'Run cancelled',
  finishedFirst: 'Run finished before it could stop',
  nothingToStop: 'No run in flight',
  failedStop: 'Could not stop the run',
  lastCancelled: (reason: string) => (reason ? `Last run cancelled: ${reason}` : 'Last run cancelled'),
  catchUpLabel: 'Missed runs',
  catchUpHint: 'What to do with runs missed while Hermes was not running.',
  catchUpChoices: {
    default: 'Use the default',
    run: 'Run once when back',
    skip: 'Skip them'
  }
}
