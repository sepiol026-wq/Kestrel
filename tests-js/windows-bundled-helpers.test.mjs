// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'

test('Windows packaged-update helper contracts run in the ordinary JS lane', () => {
  const suite = fileURLToPath(new URL('../tests/install/e2e-assets/windows-bundled-helpers.test.mjs', import.meta.url))
  const output = execFileSync(process.execPath, ['--test', suite], { encoding: 'utf8', timeout: 30_000 })
  expect(output).toMatch(/(?:fail 0|# fail 0)/)
})
