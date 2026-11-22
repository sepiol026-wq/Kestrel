// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

export interface PrimaryConnectionRehomeOptions {
  clearLocalBootstrapFailure: () => void
  mode: string
  notifyConnectionApplied: () => void
  resumeFirstRunRemote: () => boolean
  teardownPrimaryBackend: (options: { soft: boolean }) => Promise<void>
}

// Production seam shared by the connection-config IPC handler and the
// first-run integration test. A remote apply that resumes the active setup
// gate must keep that connection attempt alive; ordinary mode changes tear the
// current backend down before the renderer is told to reconnect.
export async function rehomePrimaryConnection({
  clearLocalBootstrapFailure,
  mode,
  notifyConnectionApplied,
  resumeFirstRunRemote,
  teardownPrimaryBackend
}: PrimaryConnectionRehomeOptions): Promise<{ resumedFirstRunRemote: boolean }> {
  let resumedFirstRunRemote = false

  if (mode === 'remote') {
    resumedFirstRunRemote = resumeFirstRunRemote()
    clearLocalBootstrapFailure()
  }

  if (resumedFirstRunRemote) {
    return { resumedFirstRunRemote: true }
  }

  await teardownPrimaryBackend({ soft: true })
  notifyConnectionApplied()

  return { resumedFirstRunRemote: false }
}
