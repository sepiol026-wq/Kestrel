// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

export const WAKE_INDICATOR_WINDOW_WIDTH = 176
export const WAKE_INDICATOR_WINDOW_HEIGHT = 52
export const WAKE_INDICATOR_FADE_MS = 500

export const WAKE_INDICATOR_STATES = ['hidden', 'detected', 'capturing'] as const

export type WakeIndicatorState = (typeof WAKE_INDICATOR_STATES)[number]

interface DisplayLike {
  bounds: {
    height: number
    width: number
    x: number
    y: number
  }
  internal?: boolean
}

export function normalizeWakeIndicatorState(value: unknown): WakeIndicatorState {
  return WAKE_INDICATOR_STATES.includes(value as WakeIndicatorState) ? (value as WakeIndicatorState) : 'hidden'
}

export function selectWakeIndicatorDisplay<T extends DisplayLike>(displays: T[], primary: T): T {
  return displays.find(display => display.internal === true) ?? primary
}

export function wakeIndicatorWindowBounds(display: DisplayLike) {
  return {
    height: WAKE_INDICATOR_WINDOW_HEIGHT,
    width: WAKE_INDICATOR_WINDOW_WIDTH,
    x: Math.round(display.bounds.x + (display.bounds.width - WAKE_INDICATOR_WINDOW_WIDTH) / 2),
    y: Math.round(display.bounds.y)
  }
}
