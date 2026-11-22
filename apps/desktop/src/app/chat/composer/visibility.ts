// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { createContext, useContext } from 'react'

import { usePaneVisible } from '@/components/pane-shell/pane-visibility'

/** Editor visibility is narrower than chat visibility while a shared float is
 * active. Background queues and explicit session actions still belong to the pane. */
export const ComposerVisibleContext = createContext<boolean | null>(null)

export function useComposerVisible(): boolean {
  const composer = useContext(ComposerVisibleContext)
  const pane = usePaneVisible()

  return composer ?? pane
}
