// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/lib/icons'

import { Pill } from '../primitives'

import { openExternal } from './open-external'
import type { BillingAccountRowView } from './use-billing-state'

export function RowValue({ onAction, row }: { onAction?: () => void; row: BillingAccountRowView }) {
  // Destructure to a const so narrowing survives into the onClick closure below.
  const { action } = row

  // Rendered as a ListRow `action`; the row owns wrapping and alignment.
  return (
    <>
      {row.value && (
        <span className="min-w-0 truncate text-[length:var(--conversation-text-font-size)] font-medium text-foreground">
          {row.value}
        </span>
      )}
      {row.pill && <Pill tone={row.pill.tone}>{row.pill.label}</Pill>}
      {row.secondaryPill && <Pill>{row.secondaryPill}</Pill>}
      {row.chips?.map(chip => (
        <Button
          disabled={chip.disabled}
          key={chip.label}
          onClick={chip.url ? () => openExternal(chip.url) : undefined}
          size="sm"
          type="button"
          variant="outline"
        >
          {chip.label}
        </Button>
      ))}
      {action && (
        <Button
          disabled={action.disabled}
          onClick={action.disabled ? undefined : onAction ? onAction : () => openExternal(action.url)}
          size="sm"
          type="button"
          variant="outline"
        >
          {action.label}
          {!action.disabled && action.url && <ExternalLink className="size-3.5" />}
        </Button>
      )}
    </>
  )
}
