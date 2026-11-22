// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

import { I18nProvider } from '@/i18n'

import { ComposerTriggerPopover } from './trigger-popover'

afterEach(cleanup)

it('reveals the complete slash description on hover without intercepting selection', async () => {
  const description = 'Complete command help '.repeat(20)
  const item = { id: '/proof', type: 'slash', label: 'proof', metadata: { display: '/proof', meta: description } }
  const onPick = vi.fn()
  render(
    <I18nProvider configClient={null} initialLocale="en">
      <ComposerTriggerPopover
        activeIndex={0}
        items={[item]}
        kind="/"
        loading={false}
        onHover={vi.fn()}
        onPick={onPick}
      />
    </I18nProvider>
  )
  const row = screen.getByRole('button')
  fireEvent.pointerMove(row, { pointerType: 'mouse' })
  expect((await screen.findByRole('tooltip')).textContent).toBe(description)
  fireEvent.click(row)
  expect(onPick).toHaveBeenCalledWith(item)
})
