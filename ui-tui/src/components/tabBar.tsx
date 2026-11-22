// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// The top tab strip: brand mark, one tab per live session, the code-mode tab,
// and the new-session button. Ink paints it above the transcript, outside the
// ScrollBox, so it never scrolls away.
//
// Tab anatomy follows opencode's strip: a one-cell indicator (index, running
// spinner), then the title, with a long title's tail faded into the bar instead
// of ellipsized so a truncated session name reads as receding, not cut.

import { Box, Text, useInput } from '@hermes/ink'
import { mix } from '@hermes/shared/color'
import { useStore } from '@nanostores/react'
import { memo, useEffect, useState } from 'react'

import type { AppLayoutActions } from '../app/interfaces.js'
import { $codeTab, setCodeTab, tabWindow } from '../app/tabStore.js'
import { $uiState } from '../app/uiStore.js'
import { useT } from '../i18n/useT.js'
import type { Theme } from '../theme.js'

/** Mascot mark: the little kestrel face the banner paints, one row tall. */
const BRAND_MARK = '▞▜▛'
const SPINNER = ['◐', '◓', '◑', '◒'] as const
/** Cells the tail of an over-long title fades over. */
const FADE_CELLS = 4
const TAB_GAP = 1

type TabBarProps = {
  actions: Pick<AppLayoutActions, 'activateLiveSession' | 'newLiveSession'>
  cols: number
}

/** Spinner frame that only ticks while some tab is running (no idle repaints). */
function useSpin(active: boolean) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (!active) {
      return
    }

    const timer = setInterval(() => setFrame(f => (f + 1) % SPINNER.length), 220)

    return () => clearInterval(timer)
  }, [active])

  return SPINNER[frame]!
}

/** Title cell: the tail fades into the bar over `FADE_CELLS` columns. */
const TabTitle = memo(function TabTitle({
  active,
  color,
  label,
  theme
}: {
  active: boolean
  color: string
  label: string
  theme: Theme
}) {
  const bg = active ? theme.color.selectionBg : undefined
  const tail = Math.min(FADE_CELLS, label.length)
  const body = label.slice(0, label.length - tail)
  const fade = label.slice(label.length - tail)
  const into = bg ?? theme.color.statusBg

  return (
    <Text backgroundColor={bg} bold={active} color={color}>
      {body}

      {[...fade].map((char, i) => (
        <Text color={mix(color, into, ((i + 1) / (tail + 1)) * 0.85)} key={i}>
          {char}
        </Text>
      ))}
    </Text>
  )
})

export const TabBar = memo(function TabBar({ actions, cols }: TabBarProps) {
  const ui = useStore($uiState)
  const codeTab = useStore($codeTab)
  const T = useT()

  const sessions = ui.roster
  const codeIndex = sessions.length
  const selectedSession = sessions.findIndex(session => session.id === ui.sid)
  const selected = codeTab ? codeIndex : Math.max(0, selectedSession)
  const spin = useSpin(sessions.some(session => session.running))

  const labels = [...sessions.map(session => session.title.trim() || session.id.slice(0, 8)), T.tabs.code]

  const indicators = [
    ...sessions.map((session, index) => (session.running ? spin : String(index + 1))),
    codeTab ? '●' : String(codeIndex + 1)
  ]

  // Exact cell budget for the strip: row padding, brand mark, the new-session
  // button, and the hint all reserve their own cells; overflow markers take
  // another ~4 each, so a second pass makes room for them when they appear.
  const hint = T.tabs.cycleHint(Math.max(1, codeIndex + 1))
  const newLabel = `+ ${T.tabs.newSession}`
  // +2 slack: the leading inter-tab gap and rounding in the marker cells.
  const fixed = 2 + BRAND_MARK.length + 1 + 1 + newLabel.length + 1 + hint.length + 1 + 2
  const budget = Math.max(12, cols - fixed)
  const first = tabWindow(labels, selected, budget)
  const win = first.hiddenLeft || first.hiddenRight ? tabWindow(labels, selected, Math.max(12, budget - 8)) : first

  const pick = (index: number) => {
    if (index === codeIndex) {
      setCodeTab(true)

      return
    }

    const target = sessions[index]

    if (!target) {
      return
    }

    setCodeTab(false)

    if (target.id !== ui.sid) {
      actions.activateLiveSession(target.id)
    }
  }

  const newSession = (e: { stopImmediatePropagation?: () => void }) => {
    e.stopImmediatePropagation?.()
    setCodeTab(false)
    actions.newLiveSession()
  }

  // Registered above the composer (this strip mounts first), so consuming the
  // key here keeps alt+digit / alt+c out of the draft text.
  useInput((input, key, event) => {
    // The declared InputEvent type omits it; the runtime class has it (repo convention).
    const swallow = () => (event as { stopImmediatePropagation?: () => void }).stopImmediatePropagation?.()

    if (key.meta && /^[1-9]$/.test(input)) {
      swallow()

      if (Number(input) - 1 <= codeIndex) {
        pick(Number(input) - 1)
      }

      return
    }

    if (key.meta && input.toLowerCase() === 'c') {
      swallow()
      setCodeTab(!codeTab)
    }
  })

  return (
    <Box flexDirection="column" flexShrink={0}>
      <Box flexDirection="row" height={1} overflow="hidden" paddingX={1} width={cols}>
        <Box flexShrink={0}>
          <Text bold color={ui.theme.color.primary}>
            {BRAND_MARK}
          </Text>

          <Text color={ui.theme.color.border}>│</Text>
        </Box>

        {win.hiddenLeft > 0 && <Text color={ui.theme.color.muted}>{` ${T.tabs.hiddenLeft(win.hiddenLeft)} `}</Text>}

        {win.labels.slice(win.start, win.end).map((label, offset) => {
          const index = win.start + offset
          const active = index === selected
          const fg = active ? ui.theme.color.text : ui.theme.color.muted
          const bg = active ? ui.theme.color.selectionBg : undefined

          return (
            <Box
              flexShrink={0}
              key={index}
              onClick={(e: { stopImmediatePropagation?: () => void }) => {
                e.stopImmediatePropagation?.()
                pick(index)
              }}
            >
              <Box width={TAB_GAP} />

              <Text backgroundColor={bg} color={fg}>
                <Text bold={active} color={active ? ui.theme.color.accent : ui.theme.color.border}>
                  {` ${indicators[index]} `}
                </Text>

                <TabTitle active={active} color={fg} label={label} theme={ui.theme} />

                <Text backgroundColor={bg}>{' '}</Text>
              </Text>
            </Box>
          )
        })}

        {win.hiddenRight > 0 && <Text color={ui.theme.color.muted}>{` ${T.tabs.hiddenRight(win.hiddenRight)} `}</Text>}

        <Box onClick={newSession}>
          <Box width={TAB_GAP} />

          <Text color={ui.theme.color.accent}>{`${newLabel} `}</Text>
        </Box>

        <Box flexGrow={1} />

        <Text color={ui.theme.color.border}>{hint}</Text>
      </Box>

      <Box paddingX={1}>
        <Text color={ui.theme.color.border}>{'─'.repeat(Math.max(0, cols - 2))}</Text>
      </Box>
    </Box>
  )
})
