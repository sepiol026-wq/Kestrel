// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import fs from 'node:fs'
import path from 'node:path'
import { runPython } from '../../../scripts/build/python.mjs'

/**
 * PM supplies the complete vendor tree, including the diagnostic hook's Python.
 * Source convenience uses the same Python entrypoint as other build helpers.
 * @param {{ source: string, out: string, cache: string, binary?: string }} options
 * @returns {string}
 */
export function prepareDmgbuild({ source, out, cache, binary }) {
  if (!binary) {
    binary = String(runPython([path.join(import.meta.dirname, 'prepare_dmgbuild.py'),
      '--out', path.join(cache, 'pm-tools'), '--cache', cache],
    { cwd: source, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] })).trim()
  }
  const vendor = path.dirname(binary)
  if (path.basename(binary) !== 'dmgbuild' || !fs.existsSync(binary) ||
      !fs.statSync(binary).isFile() || !fs.existsSync(path.join(vendor, 'python/bin/python3'))) {
    throw new Error(`PM dmgbuild launcher or paired Python is missing: ${binary}`)
  }
  const destination = path.join(out, 'dmgbuild')
  fs.rmSync(destination, { recursive: true, force: true })
  fs.cpSync(vendor, destination, { recursive: true, verbatimSymlinks: true })
  return path.join(destination, 'dmgbuild')
}
