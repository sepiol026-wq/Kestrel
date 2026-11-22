// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Standalone bundle jobs need the same tools as electron-builder, even when
// GitHub evicts the build cache before the publishing job starts.
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { readPackagingInputs, preparationRequired } from './prepared-packaging.mjs'

const require = createRequire(import.meta.url)

/** @typedef {{ makeappx: string, signtool: string, dlib: string | null, dotnetRoot: string | null }} WindowsBundleTools */
/** @typedef {{ WIN_CODESIGN_LATEST: string, getWindowsKitsBundle: (options: {winCodeSign?: NonNullable<import('app-builder-lib').Configuration['toolsets']>['winCodeSign'], resourcesDir: string}) => Promise<{kit: string}>, getAtsBundleDir: (version: string) => Promise<string>, getDotnetRuntimeDir: (version: string) => Promise<string> }} BuilderWindowsTools */

/** @returns {Promise<BuilderWindowsTools>} */
async function loadBuilderTools() {
  // app-builder-lib exports only its entry and ./internal. Resolve the
  // installed, lock-pinned package before loading its toolset implementation.
  const entry = pathToFileURL(require.resolve('app-builder-lib'))
  return import(new URL('./toolsets/winCodeSign.js', entry).href)
}

/** @param {import("app-builder-lib").Configuration} config @returns {string} */
function defaultResourcesDir(config) {
  return path.resolve(import.meta.dirname, "..", config.directories?.buildResources || "build")
}

/** @param {string} manifest @param {string} source @param {boolean} signing @param {string | undefined} target @returns {WindowsBundleTools} */
function consumeWindowsBundleTools(manifest, source, signing, target) {
  const result = readPackagingInputs(manifest, source, target).windows
  if (!result || (signing && (!result.dlib || !result.dotnetRoot))) throw preparationRequired('Missing prepared Windows signing tools')
  for (const file of [result.makeappx, result.signtool, ...(signing ? [result.dlib] : [])]) {
    if (!file || !fs.statSync(file).isFile()) throw preparationRequired(`Missing prepared Windows tool: ${file}`)
  }
  return result
}

/**
 * @param {{ signing?: boolean, config?: import('app-builder-lib').Configuration, resourcesDir?: string, load?: () => Promise<BuilderWindowsTools>, prepared?: string | null, source?: string, target?: string }} [options]
 * @returns {Promise<WindowsBundleTools>}
 */
export async function ensureWindowsBundleTools({
  signing = false,
  config = require('../electron-builder.config.cjs'),
  resourcesDir = defaultResourcesDir(config),
  load = loadBuilderTools,
  prepared = process.env.HERMES_PREPARED_PACKAGING,
  source = path.resolve(import.meta.dirname, '../../..'),
  target = process.env.HERMES_PREPARED_TARGET,
} = {}) {
  if (prepared) return consumeWindowsBundleTools(prepared, source, signing, target)
  const builder = await load()
  const configured = config.toolsets?.winCodeSign
  const { kit } = await builder.getWindowsKitsBundle({ winCodeSign: configured, resourcesDir })
  /** @type {WindowsBundleTools} */
  const result = {
    makeappx: path.join(kit, 'makeappx.exe'),
    signtool: path.join(kit, 'signtool.exe'),
    dlib: null,
    dotnetRoot: null,
  }
  if (signing) {
    if (configured != null && typeof configured === 'object') {
      // This is electron-builder's custom-toolset contract: the owner
      // provides the dlib alongside the kit and manages its runtime.
      result.dlib = path.join(kit, 'Azure.CodeSigning.Dlib.dll')
    } else {
      const version = configured == null || configured === 'latest' ? builder.WIN_CODESIGN_LATEST : configured
      const ats = await builder.getAtsBundleDir(version)
      result.dlib = path.join(ats, path.basename(kit), 'Azure.CodeSigning.Dlib.dll')
      result.dotnetRoot = await builder.getDotnetRuntimeDir(version)
    }
  }
  const files = [result.makeappx, result.signtool]
  if (result.dlib) files.push(result.dlib)
  if (result.dotnetRoot) files.push(path.join(result.dotnetRoot, 'dotnet.exe'))
  for (const file of files) {
    if (!fs.statSync(file).isFile()) throw new Error(`Windows bundle tool is not a file: ${file}`)
  }
  return result
}
