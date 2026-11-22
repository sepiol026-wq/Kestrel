// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { ShareControls } from './share-controls'

describe('ShareControls', () => {
  afterEach(() => {
    cleanup()
  })

  it('opens its dialog when the trigger has a tooltip', async () => {
    render(<ShareControls shareCode="map-code" />)

    const trigger = screen.getByRole('button', { name: 'Import / export map' })

    fireEvent.pointerMove(trigger, { pointerType: 'mouse' })
    expect((await screen.findByRole('tooltip')).textContent).toContain('Import / export map')

    fireEvent.click(trigger)

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('heading', { name: 'Import / export map' })).toBeTruthy()
  })
})
