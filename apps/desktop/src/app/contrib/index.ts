// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// The contribution-driven shell package. `controller` registers panes /
// layouts / chrome and mounts the app root; `wiring` is the data controller +
// memoized pane surfaces; `panes` holds the real-data pane bodies + statusbar
// group setters. Only the controller is a public entry (the app root renders
// it); the rest are internal to this directory.
export { ContribController } from './controller'
export { ContribWiring, WiredPane } from './wiring'
