// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Replay scheduling pressure without changing Date.now() results:
// NODE_OPTIONS="--require=$PWD/evals/desktop-reap-clock-pressure.cjs" \
//   pnpm --dir apps/desktop run test:desktop:platforms electron/backend-ownership.test.ts
// The old 1ms fixtures can expire before their first record is processed.
const now = Date.now.bind(Date)
const gate = new Int32Array(new SharedArrayBuffer(4))
Date.now = function () {
  if (new Error().stack.includes('/electron/backend-ownership.ts:')) {
    Atomics.wait(gate, 0, 0, 5)
  }
  return now()
}
