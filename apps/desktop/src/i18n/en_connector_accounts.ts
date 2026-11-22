// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { Translations } from './types'

export const enConnectorAccounts: Translations['connectorsPage']['accounts'] = {
  heading: 'Accounts',
  count: (count: number) => `${count} account${count === 1 ? '' : 's'}`,
  addAnother: 'Add another account',
  aliasLabel: 'Account name',
  aliasHint: 'Lowercase letters, numbers and dashes, up to 32. For example work or home.',
  aliasInvalid: 'Use lowercase letters, numbers and dashes, starting with a letter or number.',
  aliasTaken: 'That name is already used.',
  add: 'Connect',
  rename: 'Rename',
  renameLabel: (name: string) => `New name for ${name}`,
  renameGone: 'That account is no longer there. It was removed or replaced by a reconnect.',
  remove: 'Remove',
  removeTitle: (app: string, name: string) => `Remove the ${name} ${app} account?`,
  removeBody: 'Hermes stops acting as this account. Your other accounts stay connected.',
  retiredCount: (count: number) => `${count} retired`,
  status: {
    expired: 'Access expired',
    failed: 'Could not connect',
    inactive: 'Inactive',
    pending: 'Waiting for sign-in',
    retired: 'Replaced by a reconnect',
    revoked: 'Access revoked'
  }
}
