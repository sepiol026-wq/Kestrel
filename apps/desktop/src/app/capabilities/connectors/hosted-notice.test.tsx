// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { $freeTierSignIn } from '@/store/free-tier-sign-in'

import { HostedNotice } from './hosted-notice'

afterEach(() => {
  cleanup()
  $freeTierSignIn.set({ status: 'closed' })
})

describe('the Connectors line for a guest', () => {
  it('offers a Sign in that starts the sign-in', () => {
    render(<HostedNotice hasGuest phase="ready" />)

    expect(screen.getByText('Connections stay on this computer until you sign in.')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    expect($freeTierSignIn.get().status).toBe('requested')
  })
})
