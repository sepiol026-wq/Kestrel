// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { valueForReturnSubmit } from '../components/textInput.js'

describe('valueForReturnSubmit', () => {
  it('includes printable input that arrives in the same keypress as return', () => {
    expect(valueForReturnSubmit('为什么打字上屏，', 8, '会丢失内容')).toEqual({
      cursor: 13,
      value: '为什么打字上屏，会丢失内容'
    })
  })

  it('keeps IME commit text when it arrives in the same burst as return', () => {
    expect(valueForReturnSubmit('为什么打字上屏，', 8, '会丢失内容\r')).toEqual({
      cursor: 13,
      value: '为什么打字上屏，会丢失内容'
    })
  })

  it('leaves the draft unchanged when return carries no printable input', () => {
    expect(valueForReturnSubmit('hello', 5, '')).toEqual({ cursor: 5, value: 'hello' })
    expect(valueForReturnSubmit('hello', 5, '\r')).toEqual({ cursor: 5, value: 'hello' })
    expect(valueForReturnSubmit('hello', 5, '\n')).toEqual({ cursor: 5, value: 'hello' })
  })
})
