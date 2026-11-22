// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import '../fix-electron-tracing'

import { defineConfig } from '@playwright/test'

/**
 * Desktop install/update suite (PR-time, Linux).
 *
 * Every spec drives the packaged app a real install built, against that
 * install's real backend, and updates it through the app's own "Update now".
 * globalSetup builds the install once (scripts/install.sh + `hermes desktop
 * --build-only`); each spec restores that snapshot, so specs run serially.
 *
 *  - retries: 0 (a required lane must expose flake, not hide it);
 *  - one worker: specs share one install path (absolute paths are baked in);
 *  - per-test budget covers a real `kestrel update` (git pull + product builds +
 *    packaging) and the app's relaunch.
 */
// Local parallel runs against different install roots need separate output dirs.
const OUT = process.env.HERMES_E2E_UPDATE_OUT ?? 'update'

export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.ts',
  globalSetup: './global-setup.ts',
  timeout: 12 * 60_000,
  expect: { timeout: 60_000 },
  retries: 0,
  /* Same contract as the core lane: a required job must never be quietly
   * shrunk by a focused test, so forbidOnly is unconditional here too. */
  forbidOnly: true,
  workers: 1,
  fullyParallel: false,
  reporter: [['list'], ['html', { open: 'never', outputFolder: `../../playwright-report/${OUT}` }]],
  outputDir: `../../test-results/${OUT}`,
  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  }
})
