// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { UninstallSectionTranslations } from './types_uninstall_section'

// Settings > About > Uninstall, composed by en.ts as `settings.uninstallSection`.
export const enUninstallSection: UninstallSectionTranslations = {
  dangerZone: 'Danger zone',
  checkingInstalled: 'Checking what’s installed…',
  uninstallHermes: 'Uninstall Hermes',
  managedBody: 'This install is managed by your system, so Hermes cannot remove itself.',
  dataKept: path => `Your config, chats, and secrets live in ${path}. Removing the app does not delete them.`,
  openAppsSettings: 'Open Apps settings',
  chooseHowMuch:
    'Choose how much to remove. The app closes to finish the job; reopen the installer any time to come back.',
  confirmUninstall: 'Confirm uninstall',
  confirmBody: what => `This removes ${what}. This can’t be undone.`,
  appLabel: 'App:',
  couldNotStart: 'Uninstall could not start.',
  uninstalling: 'Uninstalling…',
  yesUninstall: 'Yes, uninstall',
  options: {
    gui: {
      title: 'Uninstall Chat GUI only',
      description: 'Remove this desktop app. The Kestrel agent, your config, and chats all stay.',
      consequence: 'the desktop Chat GUI (this app and its data)'
    },
    lite: {
      title: 'Uninstall GUI + agent, keep my data',
      description: 'Remove the app and the Kestrel agent, but keep config, chats, and secrets for a future reinstall.',
      consequence: 'the Chat GUI and the Kestrel agent (config, chats, and secrets are kept)'
    },
    full: {
      title: 'Uninstall everything',
      description: 'Remove the app, the agent, and all user data — config, chats, scheduled jobs, secrets, logs.',
      consequence: 'EVERYTHING — the Chat GUI, the Kestrel agent, and all of your config, chats, secrets, and logs'
    }
  }
}
