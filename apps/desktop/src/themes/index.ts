// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

export { ingestBackendSkin } from './backend-sync'
export { ThemeProvider, useTheme } from './context'
export { BUILTIN_THEME_LIST, BUILTIN_THEMES, DEFAULT_SKIN_NAME } from './presets'
export { requestTheme } from './request'
export { skinToDesktopTheme } from './skin'
export type { DesktopTheme, DesktopThemeColors, DesktopThemeTypography } from './types'
export type { HermesSkin } from '@hermes/shared/skin'
