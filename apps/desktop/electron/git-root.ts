// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import fs from 'node:fs'
import path from 'node:path'

import { resolveRequestedPathForIpc } from './hardening'

function findGitRoot(start, fsImpl = fs) {
  let dir = start

  for (let i = 0; i < 50; i += 1) {
    try {
      if (fsImpl.existsSync(path.join(dir, '.git'))) {
        return dir
      }
    } catch {
      return null
    }

    const parent = path.dirname(dir)

    if (parent === dir) {
      return null
    }

    dir = parent
  }

  return null
}

async function gitRootForIpc(startPath, options: { fs?: typeof fs } = {}) {
  const fsImpl = options.fs || fs
  let resolved

  try {
    resolved = resolveRequestedPathForIpc(startPath, { purpose: 'Git root' })
  } catch {
    return null
  }

  try {
    const stat = await fsImpl.promises.stat(resolved)
    const start = stat.isDirectory() ? resolved : path.dirname(resolved)

    return findGitRoot(start, fsImpl)
  } catch {
    return findGitRoot(resolved, fsImpl)
  }
}

export { findGitRoot, gitRootForIpc }
