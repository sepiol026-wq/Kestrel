// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// data-paths.ts — typed re-export of the shared pure resolver in data-paths.mjs.
// The app imports these names here (extensionless, for the tsc/esbuild build);
// the CI smoke driver imports the .mjs directly because Node's type-stripping
// cannot resolve extensionless TypeScript imports.
export { platformDefaultHermesHome, resolveDesktopHermesHome, resolveDesktopUserData } from './data-paths.mjs'
export type { HermesHomeOptions } from './data-paths.mjs'
