// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
const directory = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(path.resolve(directory, '../../apps/desktop/package.json'))
const { build } = require('esbuild')
await build({
  entryPoints: [process.argv[3] ? path.resolve(process.argv[3]) : path.join(directory, 'electron-main.ts')], outfile: process.argv[2],
  bundle: true, platform: 'node', format: 'cjs', target: 'node22', external: ['electron'],
  nodePaths: [path.resolve(directory, '../../node_modules'), path.resolve(directory, '../../apps/desktop/node_modules')]
})
