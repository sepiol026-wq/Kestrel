// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/** How `host.openSession` should treat a named profile.

A plugin/Bot Mode open is navigation, not a workspace or chrome API-home
switch. `keepAllProfilesScope` defaults true (undefined counts as true).
Pass false for an explicit profile workspace switch. */
export interface PluginOpenSessionPlan {
  /** Dial this profile's backend without making it chrome-home. */
  dialWithoutSwitching: null | string
  /** Hydration may wait until `$activeGatewayProfile` matches the target. */
  requireActiveProfileForHydration: boolean
  /** Unified Sessions list vs collapse onto the switched profile. Null = leave. */
  showAllProfiles: boolean | null
  /** Activate this profile as the workspace/API home. Null = do not steal chrome. */
  switchWorkspace: null | string
}

export function planPluginOpenSession(input: {
  activeProfile: string
  keepAllProfilesScope?: boolean
  profile: string
}): PluginOpenSessionPlan {
  const profile = (input.profile ?? '').trim()
  const activeProfile = (input.activeProfile ?? '').trim()
  const keepWorkspace = input.keepAllProfilesScope !== false

  if (!profile) {
    return {
      dialWithoutSwitching: null,
      requireActiveProfileForHydration: false,
      showAllProfiles: null,
      switchWorkspace: null
    }
  }

  if (keepWorkspace) {
    return {
      dialWithoutSwitching: profile !== activeProfile ? profile : null,
      requireActiveProfileForHydration: false,
      showAllProfiles: true,
      switchWorkspace: null
    }
  }

  return {
    dialWithoutSwitching: null,
    requireActiveProfileForHydration: true,
    showAllProfiles: false,
    switchWorkspace: profile
  }
}
