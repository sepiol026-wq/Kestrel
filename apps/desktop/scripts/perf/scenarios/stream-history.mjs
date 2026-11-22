// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Streaming into an ALREADY-LONG transcript. Same measurement as `stream`, but
// the history is mounted and allowed to settle before the recorders start, so
// what it captures is the per-delta cost that scales with transcript length —
// the regression reported in #69120.
//
// Report-only (tier: manual): the number depends on how much history the host
// can mount, so it is not gated against the committed baseline.

import stream from './stream.mjs'

export default {
  name: 'stream-history',
  tier: 'manual',
  description: 'Streaming cost with a long settled transcript already mounted.',
  run(cdp, opts = {}) {
    return stream.run(cdp, { ...opts, historyTurns: Number(opts.historyTurns ?? 200) })
  }
}
