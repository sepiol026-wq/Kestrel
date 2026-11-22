// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

export function pythonHelperPath(name: string, pythonRoot: string): string {
  // esbuild keeps import.meta.dirname relative to the shipped entry.js.
  const bundled = resolve(import.meta.dirname, 'scripts', name)

  return existsSync(bundled) ? bundled : resolve(pythonRoot, 'ui-tui/scripts', name)
}
