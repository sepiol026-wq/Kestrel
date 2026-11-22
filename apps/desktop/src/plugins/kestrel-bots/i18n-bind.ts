// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { PluginTranslate } from '@hermes/plugin-sdk'

// Resolve leaves when read: a module-level translator keeps its identity
// across language changes, including while an async caller holds this binding.
export type Bound<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => string
    ? (...args: A) => string
    : T[K] extends object
      ? Bound<T[K]>
      : string
}

export function bind<T extends object>(t: PluginTranslate, template: T, prefix = ''): Bound<T> {
  const out = {} as Record<string, unknown>

  for (const [key, value] of Object.entries(template)) {
    const path = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'string') {
      Object.defineProperty(out, key, { enumerable: true, get: () => t(path) })
    } else {
      out[key] = typeof value === 'function'
        ? (...args: unknown[]) => t(path, ...args)
        : bind(t, value as object, path)
    }
  }

  return out as Bound<T>
}
