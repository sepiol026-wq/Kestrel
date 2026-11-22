// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const DISABLED_BACKUP_MODES = new Set(['off', 'false', 'none', 'disabled'])
const execFileAsync = promisify(execFile)

export function preUpdateBackupEnabled(value: unknown): boolean {
  if (value === false || value === null) {
    return false
  }

  return typeof value !== 'string' || !DISABLED_BACKUP_MODES.has(value.trim().toLowerCase())
}

export interface HermesConfigRuntime {
  command?: string | null
  args?: string[]
  env?: NodeJS.ProcessEnv
  shell?: boolean
}

export async function readPreUpdateBackupEnabled(
  runtime: HermesConfigRuntime | Promise<HermesConfigRuntime>,
  hermesHome: string,
  run = execFileAsync
): Promise<boolean> {
  try {
    const resolvedRuntime = await runtime

    if (!resolvedRuntime.command || !resolvedRuntime.args) {
      return true
    }

    const result = await run(resolvedRuntime.command, resolvedRuntime.args, {
      encoding: 'utf8',
      env: { ...process.env, ...resolvedRuntime.env, HERMES_HOME: hermesHome },
      shell: Boolean(resolvedRuntime.shell),
      timeout: 15_000,
      windowsHide: true
    })

    return preUpdateBackupEnabled(JSON.parse(String(result.stdout).trim()))
  } catch {
    // A missing runtime, probe failure, or malformed response must not weaken
    // the emergency recovery path.
    return true
  }
}
