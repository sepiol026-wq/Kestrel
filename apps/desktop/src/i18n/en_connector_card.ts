// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { Translations } from './types'

export const enConnectorCard: Translations['connectors'] = {
  title: 'Connect your apps',
  connect: 'Connect',
  skip: 'Not now',
  cancel: 'Stop waiting',
  retry: 'Try again',
  grant: 'Reconnect',
  connected: 'Connected',
  checking: 'Checking your apps…',
  notConnected: 'Not connected',
  skipped: 'Skipped',
  disabled: 'Unavailable',
  failed: 'Could not connect',
  needsAuth: 'Access expired',
  opening: 'Opening sign-in…',
  waiting: 'Waiting for your browser…',
  timeout: 'Still waiting for authorization.',
  refresh: 'Refresh status',
  connectError: 'Could not start authorization. Try again.',
  connectErrorFor: (app: string) => `Could not start authorization for ${app}.`,
  unavailable: 'Connectors are unavailable for this session.',
  ownerMissing: 'Reopen this conversation to manage its connections.',
  search: 'Find an app',
  empty: 'No matching apps',
  disclaimer: 'Connecting is optional. Only authorize the apps you want Hermes to use.',
  execution: 'Connector tools',
  setup: server => `Set up ${server}`,
  openInBrowser: 'Open in browser',
  setupCancel: 'Cancel',
  authorizedToolsUnavailable: 'Authorized. Tools unavailable.',
  required: 'Required',
  namedAccount: (app: string, alias: string) => `Hermes named this ${app} account ${alias}.`,
  renameAccount: 'Rename',
  directory: {
    suggested: 'Suggested',
    allApps: 'All apps',
    receiptConnected: apps => `Connected: ${apps}`,
    receiptNone: 'No new apps connected',
    receiptTimedOut: 'Closed after 10 minutes',
    finishInBrowser: 'Finish in your browser',
    signInFailed: "Couldn't connect. Click to retry"
  }
}
