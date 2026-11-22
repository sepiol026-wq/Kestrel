// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { createElement } from 'react'
import { describe, expect, it } from 'vitest'

import { extractAlert } from './alert'

describe('extractAlert', () => {
  it('detects each GFM alert kind from the leading marker', () => {
    for (const [marker, type] of [
      ['[!NOTE]', 'note'],
      ['[!TIP]', 'tip'],
      ['[!IMPORTANT]', 'important'],
      ['[!WARNING]', 'warning'],
      ['[!CAUTION]', 'caution']
    ] as const) {
      const node = createElement('p', null, `${marker}\nBody text`)
      const result = extractAlert(node)

      expect(result?.type).toBe(type)
    }
  })

  it('is case-insensitive on the marker', () => {
    expect(extractAlert(createElement('p', null, '[!note] hi'))?.type).toBe('note')
  })

  it('returns null for a plain blockquote', () => {
    expect(extractAlert(createElement('p', null, 'just a quote'))).toBeNull()
    expect(extractAlert('no marker here')).toBeNull()
  })

  it('strips the marker token from the body', () => {
    const result = extractAlert(createElement('p', null, '[!WARNING]\nDanger ahead'))

    expect(result).not.toBeNull()
    // The marker must not survive into the rendered body.
    expect(JSON.stringify(result?.body)).not.toContain('[!WARNING]')
    expect(JSON.stringify(result?.body)).toContain('Danger ahead')
  })
})
