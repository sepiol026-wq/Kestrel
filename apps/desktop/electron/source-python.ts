// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { statSync } from 'node:fs'
import path from 'node:path'

export interface SourcePythonOptions {
  /** Explicit developer interpreter (`HERMES_DESKTOP_PYTHON`), honoured as-is. */
  override?: string
  isWindows?: boolean
  fileExists?: (candidate: string) => boolean
}

/** A checkout's own interpreter paths, in preference order. */
function interpreterPaths(isWindows: boolean): string[] {
  return isWindows
    ? [path.join('.venv', 'Scripts', 'python.exe'), path.join('venv', 'Scripts', 'python.exe')]
    : [path.join('.venv', 'bin', 'python'), path.join('venv', 'bin', 'python')]
}

function defaultFileExists(candidate: string): boolean {
  try {
    return statSync(candidate).isFile()
  } catch {
    return false
  }
}

/**
 * The interpreter that belongs to a source checkout: an explicit override, else
 * the checkout's own virtualenv, else null.
 *
 * Never a PATH Python. A system interpreter can import a checkout while lacking
 * its selected dependencies (`updater/checkout-source.ts`), so falling back
 * silently turns "this root has no runtime" into an update probe or a backend
 * running under an interpreter nothing selected — and a failed read becomes a
 * wrong answer instead of a refusal. PM deletes the in-tree `venv`/`.venv` once
 * a generation is committed, which makes null the ordinary answer for a managed
 * install: its callers resolve the installation launcher instead
 * (`resolveSourceInstallationBackend`, `readSourceUpdate`) or refuse
 * (`preflightStateDb`), and the backend ladder moves on to its next rung.
 */
export function resolveSourcePython(
  root: string,
  { override, isWindows = process.platform === 'win32', fileExists = defaultFileExists }: SourcePythonOptions = {}
): string | null {
  if (override && fileExists(override)) {
    return override
  }

  for (const relative of interpreterPaths(isWindows)) {
    const candidate: string = path.join(root, relative)

    if (fileExists(candidate)) {
      return candidate
    }
  }

  return null
}
