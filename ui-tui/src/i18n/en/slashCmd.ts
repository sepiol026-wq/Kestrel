// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Slash-command replies (app/slash/commands/*). Owned namespace: `slashCmd`.
// Composed from per-command-file parts under ./slashCmd/ so each part is
// `slashCmd.<commandFile>.<leaf>`. Command NAMES, aliases and argument syntax
// are identifiers and never live here — only the human-readable reply text.

import { slashCmdCoreEn } from './slashCmd/core.js'
import { slashCmdOpsEn } from './slashCmd/ops.js'
import { slashCmdSessionEn } from './slashCmd/session.js'

export const slashCmdEn = {
  slashCmd: {
    ...slashCmdCoreEn,
    ...slashCmdOpsEn,
    ...slashCmdSessionEn
  }
}
