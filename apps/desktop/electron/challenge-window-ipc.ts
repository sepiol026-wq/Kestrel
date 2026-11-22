// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { ipcMain } from 'electron'

import { type ChallengeWindowDependencies, createChallengeWindows, parseChallengeRequest } from './challenge-window'

/** The renderer's `hermes:freeTierChallenge:run` invoke (preload `freeTierChallenge.run`). */
export function registerChallengeWindowIpc(dependencies: ChallengeWindowDependencies): void {
  const windows = createChallengeWindows(dependencies)

  ipcMain.handle('hermes:freeTierChallenge:run', (_event, payload) => {
    const request = parseChallengeRequest(payload)

    return request ? windows.run(request) : 'refused'
  })
}
