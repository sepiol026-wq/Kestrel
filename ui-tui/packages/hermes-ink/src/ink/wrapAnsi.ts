// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import wrapAnsiNpm from 'wrap-ansi'

type WrapAnsiOptions = {
  hard?: boolean
  wordWrap?: boolean
  trim?: boolean
}

const wrapAnsiBun = typeof Bun !== 'undefined' && typeof Bun.wrapAnsi === 'function' ? Bun.wrapAnsi : null

const wrapAnsi: (input: string, columns: number, options?: WrapAnsiOptions) => string = wrapAnsiBun ?? wrapAnsiNpm

export { wrapAnsi }
