// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Tab expansion, inspired by Ghostty's Tabstops.zig
// Uses 8-column intervals (POSIX default, hardcoded in terminals like Ghostty)

import { stringWidth } from './stringWidth.js'
import { createTokenizer } from './termio/tokenize.js'

const DEFAULT_TAB_INTERVAL = 8

export function expandTabs(text: string, interval = DEFAULT_TAB_INTERVAL): string {
  if (!text.includes('\t')) {
    return text
  }

  const tokenizer = createTokenizer()
  const tokens = tokenizer.feed(text)
  tokens.push(...tokenizer.flush())

  let result = ''
  let column = 0

  for (const token of tokens) {
    if (token.type === 'sequence') {
      result += token.value
    } else {
      const parts = token.value.split(/(\t|\n)/)

      for (const part of parts) {
        if (part === '\t') {
          const spaces = interval - (column % interval)
          result += ' '.repeat(spaces)
          column += spaces
        } else if (part === '\n') {
          result += part
          column = 0
        } else {
          result += part
          column += stringWidth(part)
        }
      }
    }
  }

  return result
}
