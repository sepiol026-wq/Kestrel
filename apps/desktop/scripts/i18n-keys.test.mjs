// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { test } from 'vitest'

import { emitDesktopKeys, flattenKeys, renderKeysFile, SURFACE } from './i18n-keys.mjs'

const repoRoot = resolve(import.meta.dirname, '../../..')

test('flattenKeys lists every leaf as a sorted dotted path, functions included, arrays as one leaf', () => {
  assert.deepEqual(
    flattenKeys({ z: { count: n => `${n}`, a: 'x', 'dotted.key': 'y' }, list: ['a'], b: 'c' }),
    ['b', 'list', 'z.a', 'z.count', 'z.dotted.key']
  )
  assert.equal(renderKeysFile(['a']), `{\n  "surface": "${SURFACE}",\n  "keys": [\n    "a"\n  ]\n}\n`)
})

test('the committed locales/_keys.desktop.json matches the English catalog (run `pnpm run i18n:keys`)', async () => {
  const out = join(repoRoot, 'locales', `_keys.${SURFACE}.json`)
  const committed = JSON.parse(readFileSync(out, 'utf8'))
  assert.equal(committed.surface, SURFACE)
  assert.ok(committed.keys.includes('common.save'))
  assert.ok(committed.keys.includes('connectorsPage.searchPlaceholder'), 'function-valued entries are keys too')
  await emitDesktopKeys({ source: repoRoot, out, check: true })
})
