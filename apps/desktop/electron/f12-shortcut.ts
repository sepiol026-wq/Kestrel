// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

export interface F12Input {
  alt?: boolean
  code?: string
  control?: boolean
  isAutoRepeat?: boolean
  key: string
  meta?: boolean
  shift?: boolean
  type: string
}

export type F12ShortcutDecision = 'block' | 'devtools' | 'forward' | 'ignore'

export function f12ShortcutDecision(input: F12Input, shortcutActive: boolean, disabled: boolean): F12ShortcutDecision {
  if (input.type !== 'keyDown') {
    return 'ignore'
  }

  if (shortcutActive) {
    return 'forward'
  }

  if (disabled) {
    return 'block'
  }

  return 'devtools'
}

export function toF12KeyboardEventPayload(input: F12Input) {
  return {
    alt: Boolean(input.alt),
    code: input.code,
    control: Boolean(input.control),
    key: input.key,
    meta: Boolean(input.meta),
    repeat: Boolean(input.isAutoRepeat),
    shift: Boolean(input.shift)
  }
}
