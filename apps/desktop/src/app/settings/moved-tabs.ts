// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { CAPABILITIES_ROUTE } from '../routes'

// `plugins` used to redirect here too; it is a live Settings view again
// (Settings ▸ Plugins = each plugin's own settings pages).
const MOVED_TO_CAPABILITIES: Record<string, { param: string; tab: string }> = {
  mcp: { param: 'server', tab: 'connectors' }
}

export function movedSettingsTabRedirect(search: string): null | string {
  const params = new URLSearchParams(search)

  if (
    params.get('tab') === 'config:advanced' &&
    (params.get('page') === 'delegation' || params.get('field')?.startsWith('delegation.'))
  ) {
    params.set('tab', 'config:model')
    params.set('page', 'delegation')

    return `/settings?${params}`
  }

  const moved = MOVED_TO_CAPABILITIES[params.get('tab') ?? '']

  if (moved === undefined) {
    return null
  }

  const row = params.get(moved.param)
  const suffix = row ? `&${moved.param}=${encodeURIComponent(row)}` : ''

  return `${CAPABILITIES_ROUTE}?tab=${moved.tab}${suffix}`
}
