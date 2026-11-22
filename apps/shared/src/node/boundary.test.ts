// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// @hermes/shared is what a third-party client builds against: it must typecheck on its own, and no
// file of another workspace (ui-tui's Ink source above all) may enter its program, directly or through
// a transitive import.
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { relative, resolve, sep } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../..')
const tsc = createRequire(import.meta.url).resolve('typescript/bin/tsc')

it.each(['tsconfig.json', 'tsconfig.node.json'])('%s typechecks alone and compiles no file outside apps/shared and node_modules', project => {
  const run = (...args: string[]) =>
    execFileSync(process.execPath, [tsc, '-p', resolve(root, project), ...args], { encoding: 'utf8' })

  run('--noEmit')

  const foreign = run('--listFilesOnly')
    .split('\n')
    .filter(Boolean)
    .map(file => relative(root, resolve(file)))
    .filter(file => file.startsWith('..') && !file.split(sep).includes('node_modules'))

  expect(foreign).toEqual([])
}, 120_000)
