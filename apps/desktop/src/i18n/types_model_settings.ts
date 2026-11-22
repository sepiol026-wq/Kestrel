// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { AuxTaskCopyMap } from './types_aux_tasks'
import type { DelegationRoutingTranslations } from './types_delegation_routing'

// Settings → Model; `Translations.settings.model`.
export interface ModelSettingsTranslations {
  setupProviderFallback: string
  setUpProvider: (name: string) => string
  staleAuxBefore: (count: number, names: string) => string
  staleAuxAfter: string
  staleAuxOtherProviders: string
  moaEnabled: string
  moaSetDefault: string
  moaNewPresetPlaceholder: string
  moaAddPreset: string
  customModel: string
  customModelPlaceholder: string
  chooseFromList: string
  moaDefault: string
  moaReferenceToggle: (enabled: boolean, index: number) => string
  moaReferenceTitle: (index: number) => string
  moaAddReference: string
  loading: string
  appliesDesc: string
  provider: string
  model: string
  applying: string
  mainAppliedTitle: string
  mainAppliedMessage: (model: string) => string
  defaultsLabel: string
  reasoning: string
  reasoningOff: string
  speed: string
  speedStandard: string
  defaultsFailed: string
  loadFailed: string
  restartRequired: string
  restartBackend: string
  restartingBackend: string
  restartFailed: string
  auxiliaryTitle: string
  resetAllToMain: string
  staleAuxDismiss: string
  auxiliaryDesc: string
  setToMain: string
  change: string
  autoUseMain: string
  inheritMainEffort: string
  inheritsFrom: (task: string) => string
  followTask: (task: string) => string
  providerDefault: string
  fallbackAdd: string
  fallbackEmpty: string
  notInCatalog: string
  moaTitle: string
  moaPreset: string
  moaDescription: string
  moaAggregator: string
  moaAggregatorBilled: string
  moaReferenceHint: string
  tasks: AuxTaskCopyMap
  subagents: {
    inherit: string
    modelOnly: string
    providerLabel: string
    modelLabel: string
    direct: string
    customProvider: string
    customProviderLabel: string
    parentModel: string
    parentModelWarning: string
    directActive: string
    directClear: string
    catalogFailed: string
    draftHint: string
    /** The Routing section above the subagent model: modes, model routes, profile routes. */
    routing: DelegationRoutingTranslations
  }
}
