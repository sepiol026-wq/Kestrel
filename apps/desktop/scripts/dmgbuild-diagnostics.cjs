// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

'use strict'

const childProcess = require('node:child_process')
const { syncBuiltinESMExports } = require('node:module')
const path = require('node:path')
const { promisify } = require('node:util')

/** @param {typeof import("node:child_process").execFile} execFile @param {(chunk: Buffer) => void} [write] @returns {typeof import("node:child_process").execFile} */
function wrapDmgbuildExecFile(execFile, write = chunk => process.stderr.write(chunk)) {
  function wrapped(file, args, options, callback) {
    if (
      typeof file !== 'string' ||
      path.basename(file) !== 'dmgbuild' ||
      !Array.isArray(args) ||
      typeof options !== 'object' ||
      ((options?.env?.CUSTOM_DMGBUILD_PATH || process.env.CUSTOM_DMGBUILD_PATH)?.trim() &&
        !(options?.env?.HERMES_PREPARED_PACKAGING || process.env.HERMES_PREPARED_PACKAGING))
    ) {
      return execFile.apply(this, arguments)
    }

    // Use the interpreter and module path from the supplier's launcher.
    // A PATH shim cannot intercept dmgbuild's absolute /usr/bin/hdiutil call.
    const vendor = path.dirname(file)
    const diagnostic = path.resolve(__dirname, '../../../scripts/bundles/dmgbuild_diagnostics.py')
    const child = execFile.call(
      this,
      path.join(vendor, 'python', 'bin', 'python3'),
      [diagnostic, ...args],
      {
        ...options,
        env: { ...(options?.env || process.env), PYTHONPATH: path.join(vendor, 'python', 'lib') }
      },
      callback
    )
    // execFile buffers stderr. Tee it so a later successful retry cannot hide it.
    child.stderr?.on('data', write)
    return child
  }

  wrapped[promisify.custom] = (...args) => {
    const { promise, resolve, reject } = Promise.withResolvers()
    promise.child = wrapped(...args, (error, stdout, stderr) => {
      if (error) {
        error.stdout = stdout
        error.stderr = stderr
        reject(error)
      } else {
        resolve({ stdout, stderr })
      }
    })
    return promise
  }
  return wrapped
}

module.exports = { wrapDmgbuildExecFile }

if (process.platform === 'darwin') {
  childProcess.execFile = wrapDmgbuildExecFile(childProcess.execFile)
  syncBuiltinESMExports()
}
