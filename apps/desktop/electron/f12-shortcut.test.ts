// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import assert from 'node:assert/strict'

import { test } from 'vitest'

import { f12ShortcutDecision, toF12KeyboardEventPayload } from './f12-shortcut'

test('arbitrates only native F12 keydown and preserves repeat/modifiers for forwarding', () => {
  const input = {
    alt: true,
    code: 'F12',
    control: false,
    isAutoRepeat: true,
    key: 'F12',
    meta: true,
    shift: false,
    type: 'keyDown'
  }

  assert.equal(f12ShortcutDecision(input, true, false), 'forward')
  assert.equal(f12ShortcutDecision({ ...input, type: 'keyUp' }, true, false), 'ignore')
  assert.equal(f12ShortcutDecision(input, false, true), 'block')
  assert.equal(f12ShortcutDecision(input, false, false), 'devtools')
  assert.deepEqual(toF12KeyboardEventPayload(input), {
    alt: true,
    code: 'F12',
    control: false,
    key: 'F12',
    meta: true,
    repeat: true,
    shift: false
  })
})
