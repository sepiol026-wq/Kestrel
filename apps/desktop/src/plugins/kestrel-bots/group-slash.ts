// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { host } from '@hermes/plugin-sdk'

import { botsText } from './i18n'

/** Group rooms cannot dispatch slash commands. Keep command-shaped input out
 * of member prompts without rejecting paths such as /etc/hosts. */
export function rejectGroupSlashCommand(text: string): boolean {
  if (!/^\/[a-z][\w-]*(?:\s|$)/i.test(text)) {
    return false
  }

  host.notify({
    kind: 'warning',
    message: botsText().group.slashCommandsUnsupported
  })

  return true
}
