// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/** Reference apps. Importing this module registers them (defineWidgetApp
 *  runs at module load) — appLayout imports it once at startup. User widgets
 *  from $HERMES_HOME/tui-widgets ride the same import (async, non-fatal). */
import { loadUserWidgets, watchUserWidgets } from '../userWidgets.js'

void loadUserWidgets()
watchUserWidgets()

export { dialogTestApp } from './dialogTest.js'
export { gridTestApp } from './gridTest.js'
export { GRID_STREAM_COUNT, type GridTestState } from './gridTestState.js'
export { tickerApp, type TickerState } from './ticker.js'
export { weatherApp, type WeatherState } from './weather.js'
