// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { messages } from '../i18n/runtime.js'
import type { PanelSection } from '../types.js'

export const setupRequiredTitle = (): string => messages().content.setup.title

export const buildSetupRequiredSections = (): PanelSection[] => {
  const s = messages().content.setup

  return [
    {
      text: s.intro
    },
    {
      rows: [
        ['/setup', s.setupRow],
        ['/model', s.modelRow],
        ['Ctrl+C', s.exitRow]
      ],
      title: s.actions
    },
    {
      text: s.footer
    }
  ]
}
