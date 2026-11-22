// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Tiny FPS tracker fed by ink's onFrame callback. Each entry is an Ink
// frame (React commit + drain-only frames) — the right notion for
// user-perceived motion.
//
// Zero-cost when HERMES_TUI_FPS is unset: trackFrame is undefined so the
// onFrame callback short-circuits at the optional chain.

import { atom } from 'nanostores'

import { SHOW_FPS } from '../config/env.js'

const WINDOW_SIZE = 30

export type FpsState = {
  fps: number
  /** Wraps at JS-safe int — diff pairs in a debug overlay safely. */
  totalFrames: number
  /** Ink render-phase total for the last frame. */
  lastDurationMs: number
}

export const $fpsState = atom<FpsState>({ fps: 0, lastDurationMs: 0, totalFrames: 0 })

const timestamps: number[] = []
let totalFrames = 0

export const trackFrame = SHOW_FPS
  ? (durationMs: number) => {
      timestamps.push(performance.now())

      if (timestamps.length > WINDOW_SIZE) {
        timestamps.shift()
      }

      totalFrames++

      if (timestamps.length < 2) {
        return
      }

      const elapsed = (timestamps[timestamps.length - 1]! - timestamps[0]!) / 1000

      if (elapsed > 0) {
        $fpsState.set({
          fps: Math.round(((timestamps.length - 1) / elapsed) * 10) / 10,
          lastDurationMs: Math.round(durationMs * 100) / 100,
          totalFrames
        })
      }
    }
  : undefined
