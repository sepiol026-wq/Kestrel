// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { test } from 'vitest'

import { gitRootForIpc } from './git-root'

function mkTmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'hermes-git-root-'))
}

test('gitRootForIpc returns null for invalid and device paths', async () => {
  assert.equal(await gitRootForIpc(''), null)
  assert.equal(await gitRootForIpc('   '), null)
  assert.equal(await gitRootForIpc(null), null)
  assert.equal(await gitRootForIpc('\\\\?\\C:\\secret'), null)
  assert.equal(await gitRootForIpc('file:///%E0%A4%A'), null)
})

test('gitRootForIpc resolves directories files missing descendants and file URLs', async () => {
  const root = mkTmpDir()

  try {
    const gitDir = path.join(root, '.git')
    const srcDir = path.join(root, 'src')
    const filePath = path.join(srcDir, 'index.ts')
    fs.mkdirSync(gitDir)
    fs.mkdirSync(srcDir)
    fs.writeFileSync(filePath, 'export {}\n', 'utf8')

    assert.equal(await gitRootForIpc(root), root)
    assert.equal(await gitRootForIpc(srcDir), root)
    assert.equal(await gitRootForIpc(filePath), root)
    assert.equal(await gitRootForIpc(pathToFileURL(filePath).toString()), root)
    assert.equal(await gitRootForIpc(path.join(srcDir, 'missing.ts')), root)
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})
