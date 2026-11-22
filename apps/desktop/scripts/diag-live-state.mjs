// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Quick state probe of the running hgui instance via CDP.
import { attach } from './perf/lib/launch.mjs'

const { cdp, teardown } = await attach({ port: 9222 })

try {
  await cdp.send('Runtime.enable')

  const state = await cdp.eval(`(() => {
    const rc = !!window.__RENDER_COUNTS__
    const pl = !!window.__PERF_LIVE__
    const tiles = window.__HERMES_SESSION_TILES__ ? Object.keys(window.__HERMES_SESSION_TILES__.states()).length : -1
    const gw = document.querySelector('[data-slot="statusbar"]')?.textContent?.slice(0, 120) ?? '(no statusbar)'
    const sidebarRows = document.querySelectorAll('[data-slot="sidebar"] [data-session-id], [data-tree-group] a').length
    return JSON.stringify({ rc, pl, tiles, gw, sidebarRows, title: document.title, url: location.href.slice(0, 80) })
  })()`)

  console.log(state)
} finally {
  teardown?.()
}
