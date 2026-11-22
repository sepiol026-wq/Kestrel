// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { CronControlCopy } from './types_cron_control'

export const deCronControl: CronControlCopy = {
  stop: 'Stoppen',
  stopping: 'Wird gestoppt…',
  stopped: 'Lauf abgebrochen',
  finishedFirst: 'Lauf war vor dem Stoppen fertig',
  nothingToStop: 'Kein Lauf aktiv',
  failedStop: 'Lauf konnte nicht gestoppt werden',
  lastCancelled: (reason: string) => (reason ? `Letzter Lauf abgebrochen: ${reason}` : 'Letzter Lauf abgebrochen'),
  catchUpLabel: 'Verpasste Läufe',
  catchUpHint: 'Was mit Läufen geschieht, die verpasst wurden, während Hermes nicht lief.',
  catchUpChoices: {
    default: 'Standard verwenden',
    run: 'Einmal nachholen',
    skip: 'Überspringen'
  }
}
