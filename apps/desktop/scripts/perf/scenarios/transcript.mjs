// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Large-transcript mount cost. New scenario (no prior script measured this):
// loads N synthetic turns of mixed markdown into $messages and records the
// mount→paint time plus any longtasks the mount blocks the main thread with.
// This is the "open a long session" path — a first-impression latency.

import { sleep } from '../lib/cdp.mjs'

const OBSERVE = `
  (() => {
    window.__TM__ = { longtasks: [] }
    try {
      const po = new PerformanceObserver((l) => {
        for (const e of l.getEntries()) window.__TM__.longtasks.push(e.duration)
      })
      po.observe({ entryTypes: ['longtask'] })
      window.__TM__.po = po
    } catch {}
    return 'observing'
  })()
`

export default {
  name: 'transcript',
  tier: 'ci',
  description: 'Mount + paint cost of loading a long transcript.',
  async run(cdp, opts = {}) {
    const turns = Number(opts.turns ?? 200)

    await cdp.send('Runtime.enable')
    await cdp.eval(OBSERVE)

    const mountMs = await cdp.eval(`window.__PERF_DRIVE__.loadTranscript(${turns})`)

    // Let post-mount longtasks (content-visibility passes, virtualizer) settle.
    await sleep(1500)

    const longtasks = await cdp.eval('window.__TM__.longtasks')
    await cdp.eval('try { window.__TM__.po && window.__TM__.po.disconnect() } catch {}')
    await cdp.eval('window.__PERF_DRIVE__.reset()')

    return {
      metrics: {
        transcript_mount_ms: Math.round(mountMs * 10) / 10,
        transcript_longtask_ms: Math.round(longtasks.reduce((a, b) => a + b, 0) * 10) / 10,
        transcript_longtask_max_ms: Math.round((longtasks.length ? Math.max(...longtasks) : 0) * 10) / 10
      },
      detail: { turns, messages: turns * 2, longtasks: longtasks.length }
    }
  }
}
