// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { Translations } from '@/i18n/types'

import type { ConnectorCardModel } from './types'

export function connectorKindWord(card: ConnectorCardModel, copy: Translations['connectorsPage']['card']): string {
  if (card.residency === 'hosted') {
    return copy.kindManaged
  }

  if (card.plugin) {
    return copy.kindPlugin(card.plugin)
  }

  return card.ways.local?.inCatalog === true ? copy.kindCatalog : copy.kindCustom
}

export function showsCatalogMark(card: ConnectorCardModel): boolean {
  return card.inCatalog && card.plugin === undefined
}
