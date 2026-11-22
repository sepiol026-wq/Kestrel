// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Preload for the preview pane's `<webview>` guests. main.ts installs this
// file via `will-attach-webview` on the `persist:hermes-preview` partition
// only (see `installPreviewGuestPreload`), so no other webview inherits it.
//
// The guest runs with contextIsolation, so this preload shares the guest's
// DOM but never its JavaScript world. A preview page's `target="_blank"`
// anchors (Streamlit traceback's "Ask Google" / "Ask …" buttons —
// #112941) are intercepted here in the DOM's capture phase and handed to the
// host renderer via `sendToHost`; the host admits the scheme and routes the
// URL through the audited `hermes:openExternal` channel. A guest URL never
// becomes an Electron popup and this side never opens anything by itself.
//
// Deliberate scope: only trusted anchor clicks are forwarded. A page's direct
// `window.open` calls stay blocked (the webview has no `allowpopups`): hooking
// them would mean reaching into the guest's JS world, and this preload exposes
// nothing there.

import { installGuestExternalHandoff } from './preview-guest-preload'

const electron = require('electron') as {
  ipcRenderer: { sendToHost(channel: string, ...args: unknown[]): void }
}

installGuestExternalHandoff({
  addEventListener: (type, listener, capture) => document.addEventListener(type, listener, capture),
  sendToHost: (channel, ...args) => electron.ipcRenderer.sendToHost(channel, ...args)
})
