// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { OpenDialogOptions } from 'electron'

type DialogProperty = NonNullable<OpenDialogOptions['properties']>[number]

// `hermes:selectPaths` → `dialog.showOpenDialog` properties. Directory pickers
// carry `createDirectory` so macOS shows New Folder: a new project needs a
// folder, and the picker is where the user expects to make one.
export function selectPathsDialogProperties(options: { directories?: boolean; multiple?: boolean } = {}) {
  const properties: DialogProperty[] = options.directories ? ['openDirectory', 'createDirectory'] : ['openFile']

  if (options.multiple !== false) {
    properties.push('multiSelections')
  }

  return properties
}
