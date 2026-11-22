#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Launch the desktop renderer with HMR disabled so the React Fast Refresh
// preamble path is skipped. This sidesteps a current Vite 8 / plugin-react 6
// bug where the preamble script is not injected into index.html → renderer
// throws "$RefreshReg$ is not defined" on every TSX module → React tree
// never mounts.
//
// We're not trying to use HMR while profiling typing lag anyway. Hermes desktop
// boots, you type, profiler measures. HMR off is fine.
//
// Usage: node apps/desktop/scripts/dev-no-hmr.mjs
//        (then in another shell, run electron --remote-debugging-port=9222 .)

import { createServer } from 'vite'

const server = await createServer({
  configFile: new URL('../vite.config.ts', import.meta.url).pathname,
  root: new URL('../', import.meta.url).pathname,
  server: { hmr: false, host: '127.0.0.1', port: 5174, strictPort: true }
})
await server.listen()
server.printUrls()
