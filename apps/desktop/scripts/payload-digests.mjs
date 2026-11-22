// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { runPython } from '../../../scripts/build/python.mjs'
import fs from 'node:fs'
import path from 'node:path'

/** @param {string} payload */
export function rehashPayloadDigests(payload) {
  // Light builds have no payload. Present payloads require valid tool facts.
  if (!fs.existsSync(path.join(payload, 'manifest.json'))) return
  console.log(`[after-pack] refreshing payload hashes after signing: ${payload}`)
  runPython([
    path.resolve(import.meta.dirname, '../../../scripts/bundles/payload.py'), 'rehash', payload],
  { stdio: 'inherit' })
  console.log('[after-pack] payload hash refresh complete')
}
