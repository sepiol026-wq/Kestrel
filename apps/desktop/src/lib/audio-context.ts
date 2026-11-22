// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// One lazily-created AudioContext for the app's synthesized UI cues (wake
// chime, turn-completion sound, thinking blips). Browsers cap how many
// contexts a page may open, and these cues are short oscillator bursts that
// need no isolation from each other, so they share one instead of each holding
// its own. Nothing closes it — it lives for the window.

let ctx: AudioContext | null = null

/** The shared AudioContext, or null where WebAudio is unavailable. */
export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

      if (!Ctor) {
        return null
      }

      ctx = new Ctor()
    }

    // Autoplay policies can leave the context suspended until a gesture; a
    // resume() here recovers it once the user has interacted with the window.
    if (ctx.state === 'suspended') {
      void ctx.resume().catch(() => undefined)
    }

    return ctx
  } catch {
    return null
  }
}
