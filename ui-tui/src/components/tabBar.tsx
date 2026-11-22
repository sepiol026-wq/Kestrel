// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// The top rail: a session strip (one numbered tab per live session, windowed
// with arrow counters) and, kept apart behind a divider, the mode chips —
// `code` today — then the new-session button and the key hint. The rail sits on
// a filled surface with a shadow row under it, so it reads as a raised bar
// instead of loose text.
//
// Tab anatomy follows a browser strip: a one-cell indicator (index, running
// spinner), then the title, with a long title's tail faded into the bar instead
// of ellipsized so a truncated session name reads as receding, not cut.

import { Box, Text, useInput } from '@hermes/ink'
import { mix } from '@hermes/shared/color'
import { useStore } from '@nanostores/react'
import { memo, type ReactNode, useEffect, useState } from 'react'

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

/** Surface tones for the rail: a raised bar with a mode chip a step brighter. */
const railTones = (theme: Theme) => ({
  bar: theme.color.statusBg,
  chip: mix(theme.color.statusBg, theme.color.text, 0.1),
  shadow: mix(theme.color.statusBg, '#000000', 0.35)
})

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

/** Cells of one tab: the selected one takes the selection background and bright text. */
export const tabCellColors = (active: boolean, theme: Theme) => ({
  bg: active ? theme.color.selectionBg : undefined,
  fg: active ? theme.color.text : theme.color.muted
})

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
  const into = active ? theme.color.selectionBg : railTones(theme).bar
  const tail = Math.min(FADE_CELLS, label.length)
  const body = label.slice(0, label.length - tail)
  const fade = label.slice(label.length - tail)

  return (
    <Text backgroundColor={active ? theme.color.selectionBg : undefined} bold={active} color={color}>
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

  const tones = railTones(ui.theme)
  const sessions = ui.roster
  const codeIndex = sessions.length
  const selectedSession = sessions.findIndex(session => session.id === ui.sid)
  const spin = useSpin(sessions.some(session => session.running))

  const labels = sessions.map(session => session.title.trim() || session.id.slice(0, 8))
  const indicators = sessions.map((session, index) => (session.running ? spin : String(index + 1)))

  const compact = cols < 64
  const hint = compact ? '' : T.tabs.cycleHint(Math.max(1, codeIndex + 1))
  const newLabel = compact ? '+' : `+ ${T.tabs.newSession}`
  const codeLabel = ` ${T.tabs.code} `
  const codeWidth = codeLabel.length + 2

  // Cell budget: padding, brand mark, the mode divider + chip, new-session, hint.
  // Overflow counters take ~5 a side, so a second pass makes room for them.
  const fixed = 2 + BRAND_MARK.length + 1 + 1 + codeWidth + 1 + newLabel.length + 1 + hint.length + 1 + 4
  const budget = Math.max(10, cols - fixed)
  const sessionIndex = codeTab ? Math.max(0, selectedSession) : Math.max(0, selectedSession)
  const first = tabWindow(labels, sessionIndex, budget)

  const win =
    first.hiddenLeft || first.hiddenRight ? tabWindow(labels, sessionIndex, Math.max(10, budget - 10)) : first

  const pick = (index: number) => {
    setCodeTab(false)

    const target = sessions[index]

    if (target && target.id !== ui.sid) {
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

      if (Number(input) - 1 < codeIndex) {
        pick(Number(input) - 1)
      }

      return
    }

    if (key.meta && input.toLowerCase() === 'c') {
      swallow()
      setCodeTab(!codeTab)
    }
  })

  const codeChip = (
    <Box
      onClick={(e: { stopImmediatePropagation?: () => void }) => {
        e.stopImmediatePropagation?.()
        setCodeTab(!codeTab)
      }}
    >
      <Text backgroundColor={codeTab ? ui.theme.color.selectionBg : tones.chip} color={ui.theme.color.border}>
        {'▐'}
      </Text>

      <Text
        backgroundColor={codeTab ? ui.theme.color.selectionBg : tones.chip}
        bold={codeTab}
        color={codeTab ? ui.theme.color.accent : ui.theme.color.muted}
      >
        {codeLabel}
      </Text>

      <Text backgroundColor={codeTab ? ui.theme.color.selectionBg : tones.chip} color={ui.theme.color.border}>
        {'▌'}
      </Text>
    </Box>
  )

  const rail = (body: ReactNode) => (
    <Box flexDirection="column" flexShrink={0}>
      <Box
        backgroundColor={tones.bar}
        flexDirection="row"
        height={1}
        overflow="hidden"
        paddingX={1}
        width={cols}
      >
        {body}
      </Box>

      <Box backgroundColor={tones.bar} paddingX={1}>
        <Text backgroundColor={tones.shadow} color={tones.bar}>
          {'▁'.repeat(Math.max(0, cols - 2))}
        </Text>
      </Box>
    </Box>
  )

  if (compact) {
    const { fg } = tabCellColors(true, ui.theme)

    return rail(
      <>
        <Text bold color={ui.theme.color.primary}>
          {BRAND_MARK}
        </Text>

        <Text color={ui.theme.color.border}>│</Text>

        <Text color={ui.theme.color.muted}>{` ${T.tabs.compact(sessionIndex + 1, Math.max(1, codeIndex))} `}</Text>

        <Text backgroundColor={ui.theme.color.selectionBg} color={fg}>
          <TabTitle active color={fg} label={labels[sessionIndex] ?? T.tabs.code} theme={ui.theme} />
        </Text>

        {codeChip}

        <Box flexGrow={1} onClick={newSession}>
          <Text color={ui.theme.color.accent}>{` ${newLabel} `}</Text>
        </Box>
      </>
    )
  }

  return rail(
    <>
      <Text bold color={ui.theme.color.primary}>
        {BRAND_MARK}
      </Text>

      <Text color={ui.theme.color.border}>│</Text>

      {win.hiddenLeft > 0 && <Text color={ui.theme.color.muted}>{` ${T.tabs.hiddenLeft(win.hiddenLeft)} `}</Text>}

      {win.labels.slice(win.start, win.end).map((label, offset) => {
        const index = win.start + offset
        const active = !codeTab && index === selectedSession
        const { bg, fg } = tabCellColors(active, ui.theme)

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

            <Text color={fg}>
              <Text
                backgroundColor={bg}
                bold={active}
                color={active ? ui.theme.color.accent : ui.theme.color.border}
              >
                {` ${indicators[index]} `}
              </Text>

              <TabTitle active={active} color={fg} label={label} theme={ui.theme} />

              <Text backgroundColor={bg}>{' '}</Text>
            </Text>
          </Box>
        )
      })}

      {win.hiddenRight > 0 && <Text color={ui.theme.color.muted}>{` ${T.tabs.hiddenRight(win.hiddenRight)} `}</Text>}

      <Box flexGrow={1} />

      <Text color={ui.theme.color.border}>{' │ '}</Text>

      {codeChip}

      <Box onClick={newSession}>
        <Box width={TAB_GAP} />

        <Text color={ui.theme.color.accent}>{`${newLabel} `}</Text>
      </Box>

      {hint ? <Text color={ui.theme.color.border}>{hint}</Text> : null}
    </>
  )
})
