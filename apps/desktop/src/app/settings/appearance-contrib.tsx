// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useContributions } from '@/contrib'
import { ContribBoundary, ContribRender } from '@/contrib/react/boundary'

/**
 * Appearance settings' plugin seam — a render area at the END of the
 * Appearance page, so a plugin adds its own controls (session-colour rules,
 * theme extras) with the app's own primitives instead of injecting nodes into
 * the page and driving its widgets through React internals.
 *
 * The app's swatch grid (`ColorSwatches`, exported from the SDK) is the
 * sanctioned control for colour picking: it renders the same grid the profile
 * rail and project dialog use, with the plugin's own `onChange`.
 */
export const APPEARANCE_AREAS = {
  /** Appended to the Appearance settings page, after the built-in rows. */
  extra: 'appearance.extra'
} as const

/** Mounts every `appearance.extra` registration (own error boundary each, so a
 *  broken contribution degrades to an inline error instead of a dead page). */
export function AppearanceExtraSlot() {
  const contributions = useContributions(APPEARANCE_AREAS.extra)

  if (contributions.length === 0) {
    return null
  }

  return (
    <>
      {contributions.map(contribution => (
        <ContribBoundary id={contribution.id} key={`${contribution.source ?? 'core'}:${contribution.id}`}>
          {contribution.render && <ContribRender render={contribution.render} />}
        </ContribBoundary>
      ))}
    </>
  )
}
