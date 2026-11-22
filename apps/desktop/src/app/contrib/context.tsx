// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { createContext, memo, useContext } from 'react'

import { DecodeText } from '@/components/ui/decode-text'

import { StatusbarControls } from '../shell/statusbar-controls'

import type { WiringApi } from './types'

/** The controller publishes its wired surfaces here; every registered pane
 *  / chrome slot reads one back through `WiredPane`. */
export const ContribWiringContext = createContext<WiringApi | null>(null)

/** Render a wired surface inside a registered pane / chrome slot.
 *
 *  Memoized on `part` (its only prop): a zone re-rendering for reasons that
 *  don't touch the wiring — a drag hint sweeping the tree, a sash resize, an
 *  edit-mode toggle — re-renders the group chrome but NOT this component, so
 *  the (expensive) pane body it reads from context is untouched. When the
 *  wiring's `api` genuinely changes, the context read re-renders it as normal. */
export const WiredPane = memo(function WiredPane({ part }: { part: keyof WiringApi }) {
  const api = useContext(ContribWiringContext)

  if (!api) {
    if (part === 'statusbar') {
      return <StatusbarControls items={[]} leftItems={[]} />
    }

    return (
      <div className="grid h-full place-items-center">
        <DecodeText className="text-(--ui-text-quaternary)" cursor prefix={1} text="HERMES" />
      </div>
    )
  }

  return <>{api[part]}</>
})
