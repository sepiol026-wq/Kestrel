// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { UpdateChannelCopy } from './types_update_channel'

export const enUpdateChannel: UpdateChannelCopy = {
  title: 'Update channel',
  description: 'Stable installs published releases only. Every commit follows the main branch as changes land.',
  stable: 'Stable releases',
  main: 'Every commit',
  stableConfirmTitle: 'Switch to stable releases?',
  stableConfirmBody:
    'Hermes will move to the latest published release, which can be older than the code you run now. Data written by newer code may not read correctly, so back it up first.',
  stableConfirm: 'Switch to stable',
  failed: 'Could not change the update channel',
  detailsLabel: 'Channel',
  branch: (b: string) => `Branch: ${b}`,
  change: 'Change',
  latestRelease: (v: string) => `You’re on the latest stable release (${v}).`,
  rollbackTitle: (v: string) => `Back to stable release ${v}`,
  rollbackBody: (v: string) =>
    `This build is newer than the stable release ${v}. Installing it moves Hermes back to that release.`,
  heldBody: (v: string) =>
    `This build is newer than stable release ${v}. Your sessions already use a gateway runtime that ${v} cannot open, so Hermes stays on this build until a newer stable release ships.`,
  rollbackAction: (v: string) => `Roll back to ${v}`,
  allChanges: 'See all changes'
}
