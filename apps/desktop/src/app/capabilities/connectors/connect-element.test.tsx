// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { I18nProvider } from '@/i18n'

import { ConnectElement } from './connect-element'
import type { AccountOperation } from './data/account-operations'

const failed: AccountOperation = {
  connectors: ['gmail'],
  deadlineAt: 1_800_000_000,
  opId: 'op_1',
  request: { connectionId: 'ca_work', reconnect: true },
  scope: 'default',
  seq: 1,
  settled: false,
  settledBy: null,
  targets: [
    {
      action: 'reconnect',
      connectUrl: 'https://example.com/old',
      connectionId: 'ca_new',
      detail: '',
      discoveryError: null,
      instructions: null,
      kind: 'connector',
      name: 'gmail',
      requiredEnv: [],
      state: 'failed',
      tools: []
    }
  ]
}

afterEach(cleanup)

describe('ConnectElement Try again', () => {
  it('stays disabled while its start is in flight, so two clicks cannot mint two sign-ins', () => {
    const view = (retrying: boolean) => (
      <I18nProvider>
        <ConnectElement
          onRetry={() => undefined}
          onStopWaiting={() => undefined}
          operation={failed}
          retrying={retrying}
        />
      </I18nProvider>
    )

    const { rerender } = render(view(true))

    expect((screen.getByRole('button', { name: 'Try again' }) as HTMLButtonElement).disabled).toBe(true)

    rerender(view(false))
    expect((screen.getByRole('button', { name: 'Try again' }) as HTMLButtonElement).disabled).toBe(false)
  })
})
