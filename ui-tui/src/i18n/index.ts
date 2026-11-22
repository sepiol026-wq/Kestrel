// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

export { en } from './en.js'
export { fetchCatalogPack, normalizeLanguageId, syncTuiLocale, TUI_SURFACE } from './loader.js'
export {
  $catalog,
  $locale,
  applyLocale,
  catalogFromPack,
  DEFAULT_LOCALE,
  formatPositional,
  getLocale,
  messages,
  resetLocale,
  t,
  translateFrom
} from './runtime.js'
export type { CatalogPack, MessageLeaf, TranslationKey, Translations } from './types.js'
export { useLocale, useT } from './useT.js'
