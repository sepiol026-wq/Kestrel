// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useStore } from '@nanostores/react'
import { useEffect } from 'react'

import { useHermesConfigRecord } from '@/app/hooks/use-config-record'
import { readUseRealProfile } from '@/app/settings/browser-real-profile-panel'
import { syncPreviewSigninsIfChanged } from '@/lib/preview-signins'
import { $connection } from '@/store/session'
import { isMainWindow } from '@/store/windows'

/**
 * App launch (and any later change that did not come through the Settings toggle, e.g. a config edit): bring
 * the in-app browser's real-profile sign-ins in line with `browser.use_real_profile` for the active scope.
 * Main window only, so several windows never import at once; local backends only (main re-checks).
 */
export function usePreviewSigninsBoot() {
  const { data: config, writeScope: scope } = useHermesConfigRecord()
  const local = useStore($connection)?.mode === 'local'
  const enabled = config ? readUseRealProfile(config) : null
  const connectionId = scope?.connectionId ?? null
  const profile = scope?.profile ?? null

  useEffect(() => {
    if (!local || enabled === null || !isMainWindow()) {
      return
    }

    void syncPreviewSigninsIfChanged(enabled, { connectionId, profile })?.catch(() => undefined)
  }, [connectionId, enabled, local, profile])
}

/** Mount point for usePreviewSigninsBoot: renders nothing. */
export function PreviewSigninsBoot() {
  usePreviewSigninsBoot()

  return null
}
