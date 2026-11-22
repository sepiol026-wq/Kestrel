// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Input } from './input'

afterEach(cleanup)

describe('Input', () => {
  it('forwards value/onChange through the adorned field', () => {
    const onChange = vi.fn()
    const { getByRole } = render(<Input aria-label="amount" onChange={onChange} prefix="$" value="" />)

    fireEvent.change(getByRole('textbox'), { target: { value: '100' } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('disables the field when disabled', () => {
    const { getByRole } = render(<Input aria-label="amount" disabled prefix="$" />)
    const el = getByRole('textbox') as HTMLInputElement

    expect(el.disabled).toBe(true)
  })
})
