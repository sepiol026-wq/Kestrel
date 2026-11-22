// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { TranslationOverrides } from './define-locale'

export const deConnectorCard: TranslationOverrides['connectors'] = {
  title: 'Verbinden Sie Ihre Apps',
  connect: 'Verbinden',
  skip: 'Nicht jetzt',
  cancel: 'Warten beenden',
  retry: 'Erneut versuchen',
  grant: 'Neu verbinden',
  connected: 'Verbunden',
  checking: 'Ihre Apps werden geprüft…',
  notConnected: 'Verbindung fehlgeschlagen',
  skipped: 'Übersprungen',
  disabled: 'Nicht verfügbar',
  failed: 'Verbindung fehlgeschlagen',
  needsAuth: 'Zugriff abgelaufen',
  opening: 'Anmeldung wird geöffnet…',
  waiting: 'Schließen Sie die Verbindung im Browser ab…',
  timeout: 'Freigabe steht noch aus.',
  refresh: 'Status aktualisieren',
  connectError: 'Freigabe konnte nicht gestartet werden. Versuchen Sie es erneut.',
  connectErrorFor: app => `Die Freigabe für ${app} konnte nicht gestartet werden.`,
  unavailable: 'Verbindungen sind für diese Session nicht verfügbar.',
  ownerMissing: 'Öffnen Sie diese Konversation erneut, um ihre Verbindungen zu verwalten.',
  search: 'App finden',
  empty: 'Keine passende App',
  disclaimer: 'Das Verbinden ist freiwillig. Geben Sie nur den Apps Zugriff, die Hermes verwenden soll.',
  execution: 'Verbindungs-Tools',
  setup: server => `${server} einrichten`,
  openInBrowser: 'Im Browser öffnen',
  setupCancel: 'Abbrechen',
  authorizedToolsUnavailable: 'Autorisiert. Tools nicht verfügbar.',
  required: 'Erforderlich',
  namedAccount: (app: string, alias: string) => `Hermes hat dieses ${app}-Konto ${alias} genannt.`,
  renameAccount: 'Umbenennen',
  directory: {
    suggested: 'Vorgeschlagen',
    allApps: 'Alle Apps',
    receiptConnected: apps => `Verbunden: ${apps}`,
    receiptNone: 'Keine neuen Apps verbunden',
    receiptTimedOut: 'Nach 10 Minuten geschlossen',
    finishInBrowser: 'Im Browser abschließen',
    signInFailed: 'Verbindung fehlgeschlagen. Zum Wiederholen klicken'
  }
}
