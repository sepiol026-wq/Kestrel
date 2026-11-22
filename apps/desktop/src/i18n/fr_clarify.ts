// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { ClarifyCopy } from './types_clarify'

export const frClarify: Partial<ClarifyCopy> = {
  notReady: "La demande de clarification n'est pas encore prête",
  gatewayDisconnected: "La Gateway Hermes n'est pas connectée",
  sendFailed: "Impossible d'envoyer la réponse de clarification",
  loadingQuestion: 'Chargement de la question…',
  other: 'Autre (saisissez votre réponse)',
  placeholder: 'Saisissez votre réponse…',
  skip: 'Passer',
  skipped: 'Ignoré',
  noAnswer: 'Pas de réponse',
  confirmAndContinueLabel: 'Confirmer et continuer',
  singleSelectHint: 'Choisir une réponse',
  multiSelectHint: 'Choisir toutes les réponses qui s’appliquent',
  oneQuestion: '1 question',
  questionProgress: (answered, total) => `${answered} réponse${answered === 1 ? '' : 's'} sur ${total}`,
  notDelivered:
    "Cette question n'a pas atteint l'app, elle ne peut donc pas être répondue ici. Appuyez sur Arrêter pour terminer le tour, puis répondez dans le chat."
}
