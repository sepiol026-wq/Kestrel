// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// tests/install/e2e-assets runs from the checkout but has no package.json of
// its own: its typed drivers reach the dependencies tests-js declares through
// this module, which resolves them from tests-js wherever the install put them.
export { _electron, type ElectronApplication, type Page } from '@playwright/test'
export { z } from 'zod'
