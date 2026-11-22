// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

export { BUNDLED_LOCALES, isBundledLocale, TRANSLATIONS } from './catalog'
export {
  getConfigDisplayLanguage,
  type I18nConfigClient,
  type I18nContextValue,
  I18nProvider,
  useI18n,
  withConfigDisplayLanguage
} from './context'
export {
  DEFAULT_LOCALE,
  isLocale,
  isRtlLocale,
  isSupportedLocaleValue,
  type LanguageOption,
  languageOptions,
  LOCALE_OPTIONS,
  localeConfigValue,
  localeMeta,
  normalizeLocale
} from './languages'
export { LocalizedTabTitle } from './localized-tab-title'
export {
  createPluginI18n,
  type PluginI18n,
  type PluginLocaleBundles,
  type PluginMessages,
  type PluginMessageValue,
  type PluginTranslate,
  registerPluginLocales,
  translatePlugin,
  usePluginI18n
} from './plugin-i18n'
export {
  $appLocaleVersion,
  type AppLocaleRegistration,
  type AppLocaleSource,
  isRegisteredLocale,
  registerAppLocale,
  resolveTranslations,
  unregisterAppLocaleSource
} from './registry'
export { runtimeTranslations, setRuntimeI18nLocale, translateNow } from './runtime'
export type { BundledLocale, Locale, ToolTitleKey, Translations } from './types'
