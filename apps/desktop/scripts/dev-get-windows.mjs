// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// First step of `dev:electron`, `profile:main` and `profile:main:cpu`: fetch get-windows' win32
// binding into node_modules (see ensureDevGetWindowsBinding).
import { ensureDevGetWindowsBinding } from './stage-native-deps.mjs'

ensureDevGetWindowsBinding()
