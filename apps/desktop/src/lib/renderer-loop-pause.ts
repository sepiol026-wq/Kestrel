// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

interface WindowStatePayload {
  isMinimized?: boolean
  isVisible?: boolean
}

export const RENDERER_ANIMATIONS_PAUSED_ATTRIBUTE = 'data-renderer-animations-paused'

export function createRendererLoopPauseController(onChange: () => void, { pauseWhenUnfocused = false } = {}) {
  let windowPaused = false
  let windowFocused = document.hasFocus()

  const onVisibilityChange = () => onChange()

  const onBlur = () => {
    if (windowFocused) {
      windowFocused = false
      onChange()
    }
  }

  const onFocus = () => {
    if (!windowFocused) {
      windowFocused = true
      onChange()
    }
  }

  const offWindowState = window.hermesDesktop?.onWindowStateChanged?.((payload: WindowStatePayload) => {
    const next = payload?.isMinimized === true || payload?.isVisible === false

    if (windowPaused === next) {
      return
    }

    windowPaused = next
    onChange()
  })

  document.addEventListener('visibilitychange', onVisibilityChange)

  if (pauseWhenUnfocused) {
    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)
  }

  return {
    dispose: () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
      offWindowState?.()
    },
    isPaused: () => document.visibilityState === 'hidden' || (pauseWhenUnfocused && !windowFocused) || windowPaused
  }
}

/**
 * Mirrors the main window's observability onto :root so continuous decorative
 * CSS animations can sleep with the JS renderer loops. The caller owns the
 * returned cleanup; overlay windows intentionally do not install this state.
 */
export function installRendererAnimationPauseState(): () => void {
  const root = document.documentElement
  let controller: ReturnType<typeof createRendererLoopPauseController>

  const sync = () => root.toggleAttribute(RENDERER_ANIMATIONS_PAUSED_ATTRIBUTE, controller.isPaused())

  controller = createRendererLoopPauseController(sync)
  sync()

  return () => {
    controller.dispose()
    root.removeAttribute(RENDERER_ANIMATIONS_PAUSED_ATTRIBUTE)
  }
}
