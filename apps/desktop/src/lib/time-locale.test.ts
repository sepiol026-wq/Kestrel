// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { expect, it } from 'vitest'

import { DAY, HOUR, MINUTE, relativeTime, SECOND } from './time'

it.each(['en', 'ja', 'zh', 'zh-hant', 'ar', 'ru', 'fr', 'de', 'es'])('formats relative times in the selected %s locale', locale => {
  const format = new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style: 'short' })

  for (const [unit, size] of [['second', SECOND], ['minute', MINUTE], ['hour', HOUR], ['day', DAY]] as const) {
    for (const count of [-2, 2]) {
      expect(relativeTime(count * size, 0, locale)).toBe(format.format(count, unit))
    }
  }
})
