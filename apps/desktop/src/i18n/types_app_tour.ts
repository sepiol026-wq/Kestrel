// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

interface TourStopCopy {
  title: string
  text: string
}

/** The app's own tour, run when `gui_tour` starts with no steps. */
export interface AppTourTranslations {
  sessions: TourStopCopy
  composer: TourStopCopy
  newSession: TourStopCopy
  model: TourStopCopy
  /** Appended to the model stop when this computer can run a local model. */
  modelLocal: string
  capabilities: TourStopCopy
  messaging: TourStopCopy
  rightPane: TourStopCopy
}
