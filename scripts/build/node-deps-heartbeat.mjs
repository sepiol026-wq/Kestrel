// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// The checkout lock's heartbeat, a worker thread of the run that holds it (node-deps-lock.mjs):
// refreshes the lock until it is released, or until the lock is gone or holds another run's token
// (broken while this process was stopped). Any other error (an antivirus or indexer handle on
// Windows, ESTALE on NFS, EMFILE) is retried on the next beat: stopping would let a waiter break
// a live lock. flags[0]: released.
import { readFileSync, utimesSync } from 'node:fs'
import { workerData } from 'node:worker_threads'

const { lock, token, state, beat } = workerData
const flags = new Int32Array(state)
const timer = setInterval(() => {
  if (Atomics.load(flags, 0)) return clearInterval(timer)
  try {
    if (!readFileSync(lock, 'utf8').includes(token)) return clearInterval(timer)
    const now = new Date()
    utimesSync(lock, now, now)
  } catch (error) {
    if (error.code === 'ENOENT') clearInterval(timer)
  }
}, beat)
