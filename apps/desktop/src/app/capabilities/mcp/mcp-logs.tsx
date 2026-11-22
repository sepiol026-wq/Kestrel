// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useStore } from '@nanostores/react'
import { useEffect, useState } from 'react'

import { getLogs } from '@/hermes'
import { startCompletionPoll } from '@/lib/completion-poll'
import { $activeGatewayProfile } from '@/store/profile'

export const LOG_POLL_MS = 2000

// Current banner: `<asctime> ===== starting …`; files written before it use `===== [<time>] starting …`.
const STDIO_MARKER_RE = /^(?:\d{4}-\d{2}-\d{2} [\d:,]+ )?===== (?:\[.*\] )?starting MCP server '(.+)' =====$/

export function filterStdioSections(lines: string[], server: string): string[] {
  const out: string[] = []
  let inSection = false

  for (const line of lines) {
    const marker = STDIO_MARKER_RE.exec(line.trim())

    if (marker) {
      inSection = marker[1] === server
    }

    if (inSection) {
      out.push(line)
    }
  }

  return out
}

export type McpLogSource = 'agent' | 'stdio'

export function useMcpLogLines(server: null | string, source: McpLogSource): null | string[] {
  const [lines, setLines] = useState<null | string[]>(null)
  const activeProfile = useStore($activeGatewayProfile)

  useEffect(() => {
    setLines(null)

    return startCompletionPoll({
      delayMs: LOG_POLL_MS,
      poll: async () => {
        const response =
          source === 'stdio'
            ? await getLogs({ file: 'mcp', lines: 500 })
            : await getLogs({ file: 'agent', lines: 300, search: server ?? 'mcp' })

        return source === 'stdio' && server ? filterStdioSections(response.lines, server) : response.lines
      },
      publish: setLines
    })
  }, [server, source, activeProfile])

  return lines
}
