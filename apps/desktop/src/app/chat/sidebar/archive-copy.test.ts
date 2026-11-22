// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { TRANSLATIONS } from '@/i18n/catalog'

import { resolveSessionRowClick } from './session-row-gesture'

describe('archived-session instructions', () => {
  it('advertises modifiers that archive rather than open a tab in every locale', () => {
    for (const [locale, copy] of Object.entries(TRANSLATIONS)) {
      const intro = copy.settings.sessions.archivedIntro

      const modifiers = {
        altKey: /Alt|Option|⌥/.test(intro),
        shiftKey: /Shift|⇧/.test(intro),
        ctrlKey: /Ctrl|⌃/.test(intro),
        metaKey: /⌘/.test(intro)
      }

      expect(resolveSessionRowClick(modifiers, { canOpenWindow: true }), locale).toBe('archive')
      expect(resolveSessionRowClick(modifiers, { canOpenWindow: false }), locale).toBe('archive')
    }
  })
})
