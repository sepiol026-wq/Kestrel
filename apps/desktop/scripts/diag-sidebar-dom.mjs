// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Dump the sidebar's actual DOM shape so selectors stop being guesses.
import { attach } from './perf/lib/launch.mjs'

const { cdp, teardown } = await attach({ port: 9222 })

try {
  await cdp.send('Runtime.enable')

  const out = await cdp.eval(`(() => {
    const sidebar = document.querySelector('[data-slot="sidebar"]') ?? document.querySelector('aside')
    if (!sidebar) return '(no sidebar el)'
    // Find clickable rows: anchors or buttons with text, depth-limited sample.
    const clickables = [...sidebar.querySelectorAll('a, button, [role="button"], [data-slot]')].slice(0, 60)
    const rows = clickables.map(el => ({
      tag: el.tagName.toLowerCase(),
      slot: el.getAttribute('data-slot') ?? '',
      cls: (el.className?.baseVal ?? el.className ?? '').toString().slice(0, 40),
      text: (el.textContent ?? '').trim().slice(0, 30),
      visible: !!el.offsetParent
    })).filter(r => r.text)
    return JSON.stringify(rows.slice(0, 30), null, 1)
  })()`)

  console.log(out)
} finally {
  teardown?.()
}
