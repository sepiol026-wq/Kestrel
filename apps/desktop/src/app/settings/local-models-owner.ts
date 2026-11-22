// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { createContext, useContext } from 'react'

import type { LocalModelsOwner } from '@/store/local-runtime-jobs'

// The pane remounts per owner and every request inside it must stay pinned to
// the owner it mounted with; re-deriving from the live stores in a child
// could retarget an in-flight action at the next connection or profile.
const LocalModelsOwnerContext = createContext<LocalModelsOwner | null>(null)

export const LocalModelsOwnerProvider = LocalModelsOwnerContext.Provider

export function useScopedLocalModelsOwner(): LocalModelsOwner {
  const owner: LocalModelsOwner | null = useContext(LocalModelsOwnerContext)

  if (!owner) {
    throw new Error('useScopedLocalModelsOwner must be used inside LocalModelsOwnerProvider')
  }

  return owner
}
