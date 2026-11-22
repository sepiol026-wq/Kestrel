// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Order of the two startup steps that decide whether macOS shows a second
 * Dock icon.
 *
 * On macOS, `setAsDefaultProtocolClient` goes through Launch Services. If the
 * single-instance lock has already claimed this process, that registration
 * relaunches a second instance. The loser already has a Dock icon by the time
 * `requestSingleInstanceLock` fails and `app.exit(0)` runs, so the deep link
 * is registered before the lock.
 *
 * Other platforms have no Dock. They still take the lock at module load so a
 * second `hermes://` launch arrives as `second-instance` argv, and they
 * register the protocol on ready.
 */

export type DockLaunchStep = 'register-deep-link' | 'single-instance-lock'

export function preReadyDockLaunchSteps(platform: string): DockLaunchStep[] {
  if (platform === 'darwin') {
    return ['register-deep-link', 'single-instance-lock']
  }

  return ['single-instance-lock']
}

/** True when protocol registration is a pre-ready step that precedes the lock. */
export function deepLinkRegistersBeforeSingleInstanceLock(platform: string): boolean {
  const steps = preReadyDockLaunchSteps(platform)
  const registerAt = steps.indexOf('register-deep-link')
  const lockAt = steps.indexOf('single-instance-lock')

  return registerAt !== -1 && lockAt !== -1 && registerAt < lockAt
}
