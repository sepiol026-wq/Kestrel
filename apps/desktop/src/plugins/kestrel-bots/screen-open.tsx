// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Open a bot's Screen as a main-window workspace tab (host.openWorkspace),
 * one tab per bot; a second open refocuses the existing tab.
 */

import { host } from '@hermes/plugin-sdk'

import { botSelectionKey } from './data'
import { botsText } from './i18n'
import { displayName } from './labels'
import { noteScreenTabClosed, noteScreenTabOpened } from './screen-autoraise'
import { BotScreenPane } from './screen-pane'
import { ID } from './shared'
import type { BotMeta, RosterRow } from './types'

const openTabs = new Map<string, () => void>()

export function screenPaneId(bot: RosterRow): string {
  return `plugin-workspace:${ID}:screen:${botSelectionKey(bot)}`
}

export function openBotScreen(bot: RosterRow, meta?: BotMeta | null): void {
  if (typeof host.openWorkspace !== 'function') {
    host.notify({ kind: 'info', message: botsText().screen.openNeedsUpdate })

    return
  }

  const key = botSelectionKey(bot)

  if (openTabs.has(key)) {
    host.revealPane(screenPaneId(bot))

    return
  }

  const close = host.openWorkspace(`${ID}:screen:${key}`, {
    title: `${displayName(bot, meta ?? null)} · ${botsText().screen.title}`,
    minWidth: '28rem',
    render: () => <BotScreenPane bot={bot} />,
    onClose: () => {
      openTabs.delete(key)
      noteScreenTabClosed(bot)
    }
  })

  openTabs.set(key, close)
  noteScreenTabOpened(bot)
}
