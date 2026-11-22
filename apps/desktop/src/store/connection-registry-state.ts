// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { atom } from 'nanostores'

import type { DesktopConnectionKind, DesktopConnectionsRegistry } from '@/global'

/** Null only for the legacy profile-only Desktop topology. Once Electron has
 * published a registry, profile names are source-local and are not owners. */
export const $connectionsRegistry = atom<DesktopConnectionsRegistry | null>(null)

export function registryConnectionKind(connectionId: string): DesktopConnectionKind | undefined {
  return $connectionsRegistry.get()?.connections.find(entry => entry.id === connectionId)?.kind
}

export function hasRegistryTopology(): boolean {
  // The bridge exists before its asynchronous cache load. Treat that window
  // (and a failed list IPC) as registry topology so owner routing fails closed;
  // only an older Desktop without the registry capability is truly legacy.
  return $connectionsRegistry.get() !== null || Boolean(window.hermesDesktop?.connections?.list)
}
