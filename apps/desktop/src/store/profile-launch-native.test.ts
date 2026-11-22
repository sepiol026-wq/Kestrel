// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { afterAll, expect, it, vi } from 'vitest'

import { activeGatewayProfileKey } from '@/store/gateway'
import { $activeGatewayProfile } from '@/store/profile'

// The twin of profile-launch-webapp.test.ts: only a browser host starts on its server's profile.
// Electron's preload installs the bridge before any renderer module evaluates, so native Desktop
// starts on `default` even if a page global names another profile.
vi.hoisted(() => {
  Object.assign(window, { __HERMES_DASHBOARD_PROFILE__: 'solo', hermesDesktop: {} })
})

afterAll(() => {
  Reflect.deleteProperty(window, '__HERMES_DASHBOARD_PROFILE__')
  Reflect.deleteProperty(window, 'hermesDesktop')
})

it('native Desktop starts on default', () => {
  expect($activeGatewayProfile.get()).toBe('default')
  expect(activeGatewayProfileKey()).toBe('default')
})
