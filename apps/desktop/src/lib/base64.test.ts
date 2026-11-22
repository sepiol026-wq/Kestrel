// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { bytesToBase64 } from './base64'

describe('bytesToBase64', () => {
  it('encodes ArrayBuffer and Uint8Array inputs through the same path', () => {
    const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47])

    expect(bytesToBase64(bytes)).toBe('iVBORw==')
    expect(bytesToBase64(bytes.buffer)).toBe('iVBORw==')
  })
})
