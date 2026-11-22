// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// TUI i18n type contract. `Translations` is derived from the bundled English
// catalog: adding a string to en.ts is the whole schema change.

import type { en } from './en.js'

export type Translations = typeof en

/** A catalog leaf: a fixed string or a positional-argument formatter. */
export type MessageLeaf = ((...args: never[]) => string) | string

type Join<A extends string, B extends string> = A extends '' ? B : `${A}.${B}`

type Leaves<T, Prefix extends string = ''> = T extends MessageLeaf
  ? Prefix
  : T extends readonly unknown[]
    ? Prefix
    : T extends object
      ? { [K in keyof T & string]: Leaves<T[K], Join<Prefix, K>> }[keyof T & string]
      : never

/** Every flat dotted key of the catalog (`status.ready`, `prompt.approval.title`). */
export type TranslationKey = Leaves<Translations>

/** The flat `{lang, surface, messages}` shape `i18n.catalog` returns; `messages`
 *  is dotted-key → string (function leaves as `{0}`/`{1}` templates). */
export interface CatalogPack {
  lang: string
  messages: Record<string, string>
  surface: string
}
