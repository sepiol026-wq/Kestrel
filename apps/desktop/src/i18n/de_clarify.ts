// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { ClarifyCopy } from './types_clarify'

export const deClarify: Partial<ClarifyCopy> = {
  notReady: 'Klärungsanfrage ist noch nicht bereit',
  gatewayDisconnected: 'Hermes-Gateway ist nicht verbunden',
  sendFailed: 'Klärungsantwort konnte nicht gesendet werden',
  loadingQuestion: 'Frage wird geladen…',
  other: 'Anderes (Antwort eingeben)',
  placeholder: 'Geben Sie Ihre Antwort ein…',
  skip: 'Überspringen',
  skipped: 'Übersprungen',
  noAnswer: 'Keine Antwort',
  confirmAndContinueLabel: 'Bestätigen und fortfahren',
  singleSelectHint: 'Eines auswählen',
  multiSelectHint: 'Alle Treffer auswählen',
  oneQuestion: '1 Frage',
  questionProgress: (answered, total) => `${answered} von ${total} beantwortet`,
  notDelivered:
    'Diese Frage hat die App nicht erreicht und kann hier nicht beantwortet werden. Klicken Sie auf Stopp, um den Durchgang zu beenden, und antworten Sie dann im Chat.'
}
