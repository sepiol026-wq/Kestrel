// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { ToolIcon, type ToolIconProps } from '@/components/ui/tool-icon'
import { codiconForFilename, codiconForLanguage } from '@/lib/markdown-code'

export interface FileTypeIconProps extends Omit<ToolIconProps, 'name'> {
  /** A code-fence language tag (e.g. `ts`, `json`). Used when no `path`. */
  language?: string
  /** A file path or bare name; its extension selects the icon. Wins over `language`. */
  path?: string
}

/**
 * Icon for a file or code language, resolved through the one mapping shared
 * with code blocks (`codiconForFilename` / `codiconForLanguage`). Renders via
 * `ToolIcon`, so it uses a filled glyph when one exists and falls back to the
 * outline codicon font otherwise. Pass a `path` for file rows or a `language`
 * for fenced code.
 */
export function FileTypeIcon({ language, path, ...props }: FileTypeIconProps) {
  const name = path ? codiconForFilename(path) : codiconForLanguage(language)

  return <ToolIcon name={name} {...props} />
}
