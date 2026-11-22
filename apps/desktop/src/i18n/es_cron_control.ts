// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { CronControlCopy } from './types_cron_control'

export const esCronControl: CronControlCopy = {
  stop: 'Detener',
  stopping: 'Deteniendo…',
  stopped: 'Ejecución cancelada',
  finishedFirst: 'La ejecución terminó antes de detenerse',
  nothingToStop: 'No hay ninguna ejecución en curso',
  failedStop: 'No se pudo detener la ejecución',
  lastCancelled: (reason: string) => (reason ? `Última ejecución cancelada: ${reason}` : 'Última ejecución cancelada'),
  catchUpLabel: 'Ejecuciones perdidas',
  catchUpHint: 'Qué hacer con las ejecuciones perdidas mientras Hermes no estaba en marcha.',
  catchUpChoices: {
    default: 'Usar el valor predeterminado',
    run: 'Ejecutar una vez al volver',
    skip: 'Omitirlas'
  }
}
