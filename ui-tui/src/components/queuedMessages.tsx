// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { Box, Text } from '@hermes/ink'

import { useT } from '../i18n/useT.js'
import { compactPreview } from '../lib/text.js'
import type { Theme } from '../theme.js'

export const QUEUE_WINDOW = 3

export function getQueueWindow(queueLen: number, queueEditIdx: number | null) {
  const start =
    queueEditIdx === null ? 0 : Math.max(0, Math.min(queueEditIdx - 1, Math.max(0, queueLen - QUEUE_WINDOW)))

  const end = Math.min(queueLen, start + QUEUE_WINDOW)

  return { end, showLead: start > 0, showTail: end < queueLen, start }
}

export function QueuedMessages({ cols, queueEditIdx, queued, t }: QueuedMessagesProps) {
  const T = useT().chatBits.queued

  if (!queued.length) {
    return null
  }

  const q = getQueueWindow(queued.length, queueEditIdx)

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text color={t.color.muted} dimColor>
        {`${T.header(queued.length)}${queueEditIdx !== null ? T.editing(queueEditIdx + 1) : ''}`}
      </Text>

      {q.showLead && (
        <Text color={t.color.muted} dimColor>
          {' '}
          …
        </Text>
      )}

      {queued.slice(q.start, q.end).map((item, i) => {
        const idx = q.start + i
        const active = queueEditIdx === idx

        return (
          <Text color={active ? t.color.accent : t.color.muted} dimColor key={`${idx}-${item.slice(0, 16)}`}>
            {active ? '▸' : ' '} {idx + 1}. {compactPreview(item, Math.max(16, cols - 10))}
          </Text>
        )
      })}

      {q.showTail && (
        <Text color={t.color.muted} dimColor>
          {'  '}
          {T.more(queued.length - q.end)}
        </Text>
      )}
    </Box>
  )
}

interface QueuedMessagesProps {
  cols: number
  queueEditIdx: number | null
  queued: string[]
  t: Theme
}
