// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// The code-mode tab: every code-ish tool call of this session (the console
// snippet, the shell command, the patch) next to what it printed. Fed by
// tool.start/tool.complete in createGatewayEventHandler; no new RPC.

import { Box, ScrollBox, Text } from '@hermes/ink'
import { useStore } from '@nanostores/react'
import { memo } from 'react'

import { $codeRuns, type CodeRun } from '../app/tabStore.js'
import { $uiState } from '../app/uiStore.js'
import { useT } from '../i18n/useT.js'
import type { Theme } from '../theme.js'

/** Rows kept from each side of a run: the tail is where the answer lives. */
const INPUT_ROWS = 12
const OUTPUT_ROWS = 16

const tail = (text: string, rows: number) => {
  const lines = text.split('\n')

  return lines.length > rows ? ['…', ...lines.slice(-rows)] : lines
}

const RunBlock = memo(function RunBlock({
  cols,
  run,
  t,
  theme
}: {
  cols: number
  run: CodeRun
  t: ReturnType<typeof useT>
  theme: Theme
}) {
  const input = tail(run.input.trimEnd(), INPUT_ROWS)
  const output = run.output ? tail(run.output.trimEnd(), OUTPUT_ROWS) : []

  return (
    <Box flexDirection="column" marginTop={1} width={Math.max(16, cols - 2)}>
      <Box>
        <Text bold color={run.running ? theme.color.accent : theme.color.ok}>
          ●{' '}
        </Text>

        <Text color={theme.color.text}>{run.name}</Text>

        {run.running ? <Text color={theme.color.muted}>{` ${t.tabs.codeRunning}`}</Text> : null}
      </Box>

      {input.map((line, i) => (
        <Box key={`i${i}`} paddingLeft={2}>
          <Text color={theme.color.border}>{'│ '}</Text>

          <Text color={theme.color.muted} wrap="truncate-end">
            {line || ' '}
          </Text>
        </Box>
      ))}

      {output.length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text color={theme.color.border}>{`  ${t.tabs.codeOutput}`}</Text>

          {output.map((line, i) => (
            <Box key={`o${i}`} paddingLeft={2}>
              <Text color={theme.color.border}>{'│ '}</Text>

              <Text color={theme.color.text} wrap="truncate-end">
                {line || ' '}
              </Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
})

export const CodePane = memo(function CodePane({ cols }: { cols: number }) {
  const ui = useStore($uiState)
  const runs = useStore($codeRuns)
  const t = useT()

  return (
    <Box flexDirection="column" flexGrow={1} flexShrink={1} paddingX={1}>
      <Box flexShrink={0}>
        <Text bold color={ui.theme.color.primary}>
          {t.tabs.codeTitle}
        </Text>

        <Text color={ui.theme.color.muted}>{`  ${runs.length} · alt+c`}</Text>
      </Box>

      {runs.length === 0 ? (
        <Text color={ui.theme.color.muted}>{t.tabs.codeEmpty}</Text>
      ) : (
        <ScrollBox flexDirection="column" flexGrow={1} flexShrink={1} stickyScroll>
          {runs.map(run => (
            <RunBlock cols={cols} key={run.id} run={run} t={t} theme={ui.theme} />
          ))}
        </ScrollBox>
      )}
    </Box>
  )
})
