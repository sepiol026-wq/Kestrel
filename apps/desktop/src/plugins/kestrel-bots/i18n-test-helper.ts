// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Resolve a Bot Mode message key against the plugin's own `en` bundle.
 *
 * Tests that render Bot Mode components stub `usePluginI18n` with this instead
 * of registering the bundle for real: registration normally happens in
 * `ctx.register`, and the registry lives behind an app-internal module a plugin
 * (or its tests) may not import.
 */

import { BOTS_LOCALES } from './i18n'

/** The same resolver against another shipped locale, for a test that has to
 *  tell a catalog string from an English literal that happens to match `en`. */
export function translateBotsIn(locale: keyof typeof BOTS_LOCALES) {
  return (key: string, ...args: unknown[]): string => {
    const value = key
      .split('.')
      .reduce<unknown>(
        (node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined),
        BOTS_LOCALES[locale]
      )

    if (typeof value === 'function') {
      return String((value as (...params: unknown[]) => string)(...args))
    }

    return typeof value === 'string' ? value : key
  }
}

export const translateBots = translateBotsIn('en')
