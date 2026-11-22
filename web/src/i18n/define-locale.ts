// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { mergeTranslations, type TranslationOverride } from '@hermes/shared/i18n'

import { en } from './en'
import type { Translations } from './types'

// Partial-locale helper: a translation file supplies only the strings it has
// translated and every missing key falls back to English, while unknown keys
// still fail the type-check.
export type TranslationOverrides = TranslationOverride<Translations>

export const defineLocale = (overrides: TranslationOverrides): Translations =>
  mergeTranslations<Translations>(en, overrides)
