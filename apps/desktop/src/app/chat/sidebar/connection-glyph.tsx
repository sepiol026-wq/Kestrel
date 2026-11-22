// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { DesktopRegistryConnection } from '@/global'
import { Cloud, Monitor, Network, Terminal } from '@/lib/icons'
import { cn } from '@/lib/utils'

import { SIDEBAR_ROW_LEAD } from './row-geometry'

// One glyph per connection kind — device, cloud, network, terminal — shared by
// the statusbar switcher, its menu, the fleet profile rail and the Bots rail so
// a gateway looks the same wherever it is named. Dependency-free on purpose
// (icons, a type and class strings) so light components can use it without
// pulling in stores.
export function ConnectionGlyph({
  className,
  connection
}: {
  className?: string
  connection: Pick<DesktopRegistryConnection, 'kind'>
}) {
  const Icon =
    connection.kind === 'local'
      ? Monitor
      : connection.kind === 'cloud'
        ? Cloud
        : connection.kind === 'ssh'
          ? Terminal
          : Network

  return (
    <span
      aria-hidden="true"
      className={cn(SIDEBAR_ROW_LEAD, 'text-(--ui-text-quaternary)', className)}
      data-connection-kind={connection.kind}
      data-slot="connection-glyph"
    >
      <Icon className="size-3" />
    </span>
  )
}
