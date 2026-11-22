// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// The Hermes home the desktop main process runs against, resolved once at boot.
// Resolving it here also registers it with the file-preview read guard, so the
// home's (and every profile's) credential stores are refused before any IPC
// read can be served.

import { resolveDesktopHermesHome } from './data-paths'
import { directoryExists } from './fs-probes'
import { setSensitiveHermesHome } from './hardening'
import { readWindowsUserEnvVar } from './windows-user-env'

export function resolveMainHermesHome(home: string): string {
  const hermesHome = resolveDesktopHermesHome({
    home,
    directoryExists,
    readWindowsHome: (): string | null => readWindowsUserEnvVar('HERMES_HOME')
  })

  setSensitiveHermesHome(hermesHome)

  return hermesHome
}
