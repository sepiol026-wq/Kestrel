// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import path from 'node:path'

/** True when `dir` lives inside a packaged app bundle / install tree. */
function isPackagedInstallPath(dir, { installRoots, isPackaged }: { installRoots: string[]; isPackaged: boolean }) {
  if (!isPackaged || !dir) {
    return false
  }

  let resolved

  try {
    resolved = path.resolve(String(dir))
  } catch {
    return false
  }

  const roots = new Set((installRoots ?? []).filter(Boolean).map(candidate => path.resolve(String(candidate))))

  for (const root of roots) {
    if (resolved === root) {
      return true
    }

    const rel = path.relative(root, resolved) as any

    if (rel && !rel.startsWith('..') && !path.isAbsolute(rel)) {
      return true
    }
  }

  return false
}

export { isPackagedInstallPath }
