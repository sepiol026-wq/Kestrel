// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Orders the macOS application menu relative to the first BrowserWindow.
 *
 * AppKit routes every key equivalent through the installed application
 * menu's delegate (`_populateFromDelegateWithEventProvider`), and Electron's
 * delegate segfaults when that callback fires before any window exists. The
 * updater's relaunch races the user's keystroke against startup, so the shell
 * died on both post-update relaunches reported in #115332.
 *
 * Two facts shape the fix:
 * - Electron installs its own default menu at `will-finish-launching` (before
 *   `ready`) unless `Menu.setApplicationMenu` has already been called, so the
 *   suppression must run at module scope, not inside `whenReady`.
 * - On macOS `Menu.setApplicationMenu(null)` never removes an already
 *   installed NSMenu; it only suppresses the default when it runs first.
 *
 * `installApplicationMenuAfterFirstWindow` is the ready-phase half: create the
 * first window, then install the menu (macOS only; the other platforms ship
 * without an application menu).
 */
export interface ApplicationMenuStartupDeps<TMenu> {
  isMac: boolean
  buildMenu: () => TMenu
  setApplicationMenu: (menu: TMenu | null) => void
  createWindow: () => void
}

export function installApplicationMenuAfterFirstWindow<TMenu>(deps: ApplicationMenuStartupDeps<TMenu>): void {
  deps.createWindow()

  if (deps.isMac) {
    deps.setApplicationMenu(deps.buildMenu())
  }
}
