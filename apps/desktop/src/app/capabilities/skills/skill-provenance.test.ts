// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import type { SkillInfo } from '@/types/hermes'

import { catalogSourceFor, isEditableProvenance } from './skill-provenance'

// #108032: externally mounted skills get an 'external' provenance tier — origin
// labeling without losing in-place edit rights (commit 8c8fc6c1ec / PR #17512).
describe('skill provenance tiers', () => {
  describe('catalogSourceFor', () => {
    it('maps every provenance tier to a distinct catalog source', () => {
      expect(catalogSourceFor('bundled')).toBe('built-in')
      expect(catalogSourceFor('hub')).toBe('hub')
      expect(catalogSourceFor('external')).toBe('external')
      expect(catalogSourceFor('agent')).toBe('local')
    })

    it('treats an absent provenance as local (older backends)', () => {
      expect(catalogSourceFor(undefined)).toBe('local')
    })
  })

  describe('isEditableProvenance', () => {
    it('keeps learned/local skills editable', () => {
      expect(isEditableProvenance('agent')).toBe(true)
    })

    it('keeps external mounts editable in place', () => {
      expect(isEditableProvenance('external')).toBe(true)
    })

    it('keeps bundled and hub skills managed by their sources', () => {
      expect(isEditableProvenance('bundled')).toBe(false)
      expect(isEditableProvenance('hub')).toBe(false)
    })

    it('treats an absent provenance as not editable (older backends predate edit rights)', () => {
      const skill: SkillInfo = { category: 'general', description: 'd', enabled: true, name: 'legacy' }
      expect(isEditableProvenance(skill.provenance)).toBe(false)
    })
  })
})
