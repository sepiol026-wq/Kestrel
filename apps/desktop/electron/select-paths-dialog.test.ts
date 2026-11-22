// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { selectPathsDialogProperties } from './select-paths-dialog'

describe('selectPathsDialogProperties', () => {
  it('lets a directory picker create a new folder (macOS hides New Folder without createDirectory)', () => {
    const properties = selectPathsDialogProperties({ directories: true, multiple: false })

    expect(properties).toContain('openDirectory')
    expect(properties).toContain('createDirectory')
  })

  it('keeps file pickers file-only and multi-select by default', () => {
    const properties = selectPathsDialogProperties({})

    expect(properties).toContain('openFile')
    expect(properties).toContain('multiSelections')
    expect(properties).not.toContain('openDirectory')
    expect(properties).not.toContain('createDirectory')
  })

  it('drops multi-select only when the caller opts out', () => {
    expect(selectPathsDialogProperties({ directories: true })).toContain('multiSelections')
    expect(selectPathsDialogProperties({ directories: true, multiple: false })).not.toContain('multiSelections')
  })
})
