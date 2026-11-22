// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// One window owns each cross-window ambient cue (turn-end sound, spoken reply)
// so N open full windows don't all fire it for the same backend event. The main
// process is the race-free owner (see electron/event-dedupe.ts). Off Electron —
// or when the bridge/claim fails — every window emits, preserving the
// single-window behavior rather than going silent.
export async function ownsAmbientCue(key: string): Promise<boolean> {
  const claim = window.hermesDesktop?.claimAmbientCue

  if (!claim) {
    return true
  }

  try {
    return await claim(key)
  } catch {
    return true
  }
}
