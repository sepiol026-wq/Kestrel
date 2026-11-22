// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n'
import { openFreeTierSignIn } from '@/store/free-tier-sign-in'

import type { HostedPhase } from './types'

function SignInNote({ text }: { text: string }) {
  const { t } = useI18n()

  return (
    <p className="flex shrink-0 items-center gap-1 text-[0.7rem] text-(--ui-text-tertiary)">
      {text}
      <Button onClick={() => openFreeTierSignIn()} size="xs" variant="text">
        {t.connectorsPage.page.signIn}
      </Button>
    </p>
  )
}

export function HostedNotice({ hasGuest, phase }: { hasGuest: boolean; phase: HostedPhase }) {
  const { t } = useI18n()
  const copy = t.connectorsPage.page

  if (phase === 'signedOut') {
    return <SignInNote text={copy.signInLine} />
  }

  if (phase === 'unavailable') {
    return <p className="shrink-0 text-[0.7rem] text-(--ui-text-tertiary)">{copy.managedUnavailable}</p>
  }

  return hasGuest ? <SignInNote text={copy.freeTierNote} /> : null
}
