// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Which emulator is hosting this TUI, when the host tells us.
 *
 * `hermes dashboard` spawns the TUI behind a PTY and mirrors it into xterm.js
 * in the browser; the bridge sets HERMES_PTY_HOST=dashboard on the child
 * (hermes_cli/pty_bridge.py — keep the two constants in sync). Native
 * terminals never set it.
 */
export const PTY_HOST_ENV = 'HERMES_PTY_HOST'
export const PTY_HOST_DASHBOARD = 'dashboard'

export const isDashboardHosted = (env: NodeJS.ProcessEnv = process.env): boolean =>
  env[PTY_HOST_ENV] === PTY_HOST_DASHBOARD
