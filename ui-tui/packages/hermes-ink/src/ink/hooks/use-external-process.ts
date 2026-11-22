// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useCallback } from 'react'

import instances from '../instances.js'

export type RunExternalProcess = () => Promise<void>

export async function withInkSuspended(run: RunExternalProcess): Promise<void> {
  const ink = instances.get(process.stdout)

  if (!ink) {
    await run()

    return
  }

  ink.enterAlternateScreen()

  try {
    await run()
  } finally {
    ink.exitAlternateScreen()
  }
}

export function useExternalProcess(): (run: RunExternalProcess) => Promise<void> {
  return useCallback((run: RunExternalProcess) => withInkSuspended(run), [])
}
