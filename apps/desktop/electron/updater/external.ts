// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// updater/external.ts — the steward-owned strategy.
//
// The stamp declares 'external' when the package owner handles updates
// without an in-app check or apply action.

import type { InstallStamp } from '../install-stamp'

import type { UpdaterApplyResultWire, UpdaterStatusWire } from './index'

export const EXTERNAL_UNSUPPORTED_MESSAGE = 'Updates are managed by the package owner outside this app.'

export const COMMIT_BUILD_UPDATE_MESSAGE: string =
  "This build doesn't get updates. Ask the developer who gave it to you for a new build."

export class ExternalStrategy {
  constructor(private readonly stamp: Pick<InstallStamp, 'source'> | null = null) {}
  readonly mechanism = 'external' as const
  readonly supported = false

  async check(): Promise<UpdaterStatusWire> {
    return {
      supported: false,
      mechanism: 'external',
      reason: this.stamp?.source === 'commit-build' ? 'commit-build' : 'bundled-not-appinstaller',
      message: this.stamp?.source === 'commit-build' ? COMMIT_BUILD_UPDATE_MESSAGE : EXTERNAL_UNSUPPORTED_MESSAGE,
      fetchedAt: Date.now()
    }
  }

  async apply(): Promise<UpdaterApplyResultWire> {
    if (this.stamp?.source === 'commit-build') {
      return { ok: false, mechanism: 'external', error: 'commit-build', message: COMMIT_BUILD_UPDATE_MESSAGE }
    }

    return { ok: true, manual: true, bundled: true, mechanism: 'external' }
  }
}
