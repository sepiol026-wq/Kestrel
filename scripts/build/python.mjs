#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/** Run build helpers with the prepared Python, never an ambient uv environment. */
import { execFileSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

/**
 * @param {string[]} args
 * @param {import('node:child_process').ExecFileSyncOptions} [options]
 */
export function runPython(args, options = {}) {
  const env = options.env ?? process.env
  if (!env.HERMES_PYTHON) {
    throw new Error('Set HERMES_PYTHON to the prepared build interpreter')
  }
  return execFileSync(env.HERMES_PYTHON, args, { stdio: 'inherit', ...options, env })
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    runPython(process.argv.slice(2))
  } catch (/** @type {unknown} */ error) {
    // execFileSync throws a child_process exception carrying .status; anything
    // else is reported as-is so a missing Python still prints a useful line.
    const detail = error instanceof Error ? error.message : String(error)
    console.error('[python build]', detail)
    const status = typeof (/** @type {any} */ (error).status) === 'number' ? /** @type {any} */ (error).status : 0
    process.exitCode = status !== 0 ? status : 1
  }
}
