// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { Text } from '@hermes/ink'
import { useStore } from '@nanostores/react'
import type { ReactNode } from 'react'

import { $uiState } from '../app/uiStore.js'
import type { ThemeColors } from '../theme.js'

export function Fg({ bold, c, children, dim, italic, literal, strikethrough, underline, wrap }: FgProps) {
  const { theme } = useStore($uiState)

  return (
    <Text color={literal ?? (c && theme.color[c])} dimColor={dim} {...{ bold, italic, strikethrough, underline, wrap }}>
      {children}
    </Text>
  )
}

export type ThemeColor = keyof ThemeColors

export interface FgProps {
  bold?: boolean
  c?: ThemeColor
  children?: ReactNode
  dim?: boolean
  italic?: boolean
  literal?: string
  strikethrough?: boolean
  underline?: boolean
  wrap?: 'end' | 'middle' | 'truncate' | 'truncate-end' | 'truncate-middle' | 'truncate-start' | 'wrap' | 'wrap-trim'
}
