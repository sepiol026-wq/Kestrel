// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type * as React from 'react'

import { Input } from './input'

interface SanitizedInputProps extends Omit<React.ComponentProps<typeof Input>, 'onChange' | 'value'> {
  value: string
  onValueChange: (value: string) => void
  // A formatter from `@/lib/sanitize` (gitRef, slug, …) run on every keystroke.
  sanitize: (raw: string) => string
}

// An <Input> that can only ever hold a valid value: every keystroke is run
// through `sanitize`, so callers never have to validate-then-reject (a space in
// a branch name becomes "-" as you type instead of erroring at submit).
export function SanitizedInput({ value, onValueChange, sanitize, ...props }: SanitizedInputProps) {
  return <Input {...props} onChange={event => onValueChange(sanitize(event.target.value))} value={value} />
}
