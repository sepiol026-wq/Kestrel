// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { RowButton } from './row-button'

afterEach(cleanup)

describe('RowButton', () => {
  it('renders a real <button> with type=button so it never submits an enclosing form', () => {
    const { getByText } = render(<RowButton>Row</RowButton>)
    const el = getByText('Row')

    expect(el.tagName).toBe('BUTTON')
    expect(el.getAttribute('type')).toBe('button')
  })
})
