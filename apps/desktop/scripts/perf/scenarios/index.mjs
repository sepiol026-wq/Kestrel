// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Scenario registry. Add a scenario module here and it's automatically
// available to the runner, the default suite (tier 'ci'), and the baseline gate.

import coldStart from './cold-start.mjs'
import firstToken from './first-token.mjs'
import idleCost from './idle-cost.mjs'
import keystroke from './keystroke.mjs'
import liveWindow from './live-window.mjs'
import multitab from './multitab.mjs'
import profileSwitch from './profile-switch.mjs'
import renderChurn from './render-churn.mjs'
import rightPane from './right-pane.mjs'
import sessionLoad from './session-load.mjs'
import sessionSwitch from './session-switch.mjs'
import stream from './stream.mjs'
import streamHistory from './stream-history.mjs'
import submit from './submit.mjs'
import transcript from './transcript.mjs'

export const SCENARIOS = {
  [stream.name]: stream,
  [streamHistory.name]: streamHistory,
  [keystroke.name]: keystroke,
  [transcript.name]: transcript,
  [multitab.name]: multitab,
  [liveWindow.name]: liveWindow,
  [renderChurn.name]: renderChurn,
  [rightPane.name]: rightPane,
  [idleCost.name]: idleCost,
  [coldStart.name]: coldStart,
  [firstToken.name]: firstToken,
  [submit.name]: submit,
  [sessionLoad.name]: sessionLoad,
  [sessionSwitch.name]: sessionSwitch,
  [profileSwitch.name]: profileSwitch
}

/** Scenarios safe to run with no LLM credits / no live backend — the default suite. */
export const CI_SCENARIOS = Object.values(SCENARIOS)
  .filter(s => s.tier === 'ci')
  .map(s => s.name)
