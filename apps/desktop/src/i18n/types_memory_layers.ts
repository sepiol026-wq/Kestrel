// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Settings > Memory & Context and Command Center > Maintenance:
// the active (saved) memory provider, a selected-but-unsaved one, and the
// built-in MEMORY.md / USER.md layer; `Translations.settings.memoryLayers`.
export interface MemoryLayersTranslations {
  activeProvider: string
  selectedProvider: string
  /** `current` is the active provider's name or `builtinMemory`. */
  selectedDesc: (current: string) => string
  builtinMemory: string
  noProvider: string
  noProviderDesc: string
  providerDesc: (name: string) => string
  providerNotReadyDesc: (name: string) => string
  providerUnknownDesc: (name: string) => string
  statusUnavailable: string
  statusUnavailableDesc: string
  retry: string
  status: {
    ready: string
    needs_config: string
    unavailable: string
    missing: string
  }
  builtinLayer: string
  onByDefault: string
  on: string
  off: string
  onlyFile: (file: string) => string
  builtinDesc: string
}
