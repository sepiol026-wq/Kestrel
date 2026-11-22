// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Production stand-in for `dev-only.ts`. `vite.config.ts` aliases the dev
// entry to this module for any build that isn't the dev server, so the
// diagnostics graph — and bippy with it — never reaches a shipped renderer.
//
// Keep this file free of imports. It exists precisely so the production
// bundle contains nothing from `debug/`.

export {}
