// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

'use client'

import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n'
import { Loader2 } from '@/lib/icons'

export function ClarifyConfirmBar({
  canConfirm,
  disabled,
  onSkip,
  submitting
}: {
  canConfirm: boolean
  disabled: boolean
  onSkip: () => void
  submitting: boolean
}) {
  const { t } = useI18n()
  const copy = t.assistant.clarify

  return (
    <div className="flex items-center justify-end gap-1">
      <Button disabled={disabled} onClick={onSkip} size="xs" type="button" variant="text">
        {copy.skip}
      </Button>
      <Button disabled={disabled || !canConfirm} size="xs" type="submit">
        {submitting ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            {copy.confirmAndContinueLabel}
            <span aria-hidden className="ml-0.5 text-[0.625rem] opacity-70">
              ⏎
            </span>
          </>
        )}
      </Button>
    </div>
  )
}
