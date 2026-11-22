// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { Codicon } from '@/components/ui/codicon'
import { Tip } from '@/components/ui/tooltip'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/utils'

export function CatalogMark({ className }: { className?: string }) {
  const { t } = useI18n()
  const label = t.connectorsPage.card.inCatalog

  return (
    <Tip label={label}>
      <span
        aria-label={label}
        className={cn('relative z-10 flex shrink-0 items-center text-(--ui-text-quaternary)', className)}
        role="img"
      >
        <Codicon name="verified-filled" size="0.75rem" />
      </span>
    </Tip>
  )
}
