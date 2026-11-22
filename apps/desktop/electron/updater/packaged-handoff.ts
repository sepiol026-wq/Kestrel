// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { RelaunchRegistration } from './relaunch'

import type { UpdaterApplyResultWire } from './index'

interface PackagedHandoffDeps {
  teardown: () => void | Promise<void>
  restore: () => Promise<void>
  emitProgress: (progress: { stage: string; message: string; percent: number | null }) => void
  relaunch?: {
    register: () => Promise<RelaunchRegistration>
    onManual: () => void
  }
}

/** Native preparation decides when it is safe to stop. Recovery has one owner. */
export async function applyPackagedHandoff(
  deps: PackagedHandoffDeps,
  apply: (stop: () => Promise<void>) => Promise<UpdaterApplyResultWire>
): Promise<UpdaterApplyResultWire> {
  let registration: RelaunchRegistration | undefined
  let teardownStarted = false

  const stop = async (): Promise<void> => {
    if (deps.relaunch) {
      registration = await deps.relaunch.register()

      if (!registration.automatic) {
        deps.relaunch.onManual()
      }
    }

    teardownStarted = true
    await deps.teardown()
  }

  try {
    return await apply(stop)
  } catch (error) {
    const errors: unknown[] = [error]

    try {
      await registration?.cancel()
    } catch (cancelError) {
      errors.push(cancelError)
    }

    if (teardownStarted) {
      try {
        await deps.restore()
      } catch (restoreError) {
        errors.push(restoreError)
      }
    }

    const message = errors
      .map((item: unknown): string => (item instanceof Error ? item.message : String(item)))
      .join('; ')

    deps.emitProgress({ stage: 'error', message, percent: null })
    throw errors.length > 1 ? new AggregateError(errors, message, { cause: error }) : error
  }
}
