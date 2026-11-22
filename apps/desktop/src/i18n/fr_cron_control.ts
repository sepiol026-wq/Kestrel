// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { CronControlCopy } from './types_cron_control'

export const frCronControl: CronControlCopy = {
  stop: 'Arrêter',
  stopping: 'Arrêt…',
  stopped: 'Exécution annulée',
  finishedFirst: 'L’exécution s’est terminée avant l’arrêt',
  nothingToStop: 'Aucune exécution en cours',
  failedStop: 'Impossible d’arrêter l’exécution',
  lastCancelled: (reason: string) => (reason ? `Dernière exécution annulée: ${reason}` : 'Dernière exécution annulée'),
  catchUpLabel: 'Exécutions manquées',
  catchUpHint: 'Que faire des exécutions manquées pendant que Hermes ne tournait pas.',
  catchUpChoices: {
    default: 'Utiliser la valeur par défaut',
    run: 'Exécuter une fois au retour',
    skip: 'Les ignorer'
  }
}
