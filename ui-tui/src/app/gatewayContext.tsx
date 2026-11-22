// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { createContext, useContext } from 'react'

import type { GatewayProviderProps, GatewayServices } from './interfaces.js'

const GatewayContext = createContext<GatewayServices | null>(null)

export function GatewayProvider({ children, value }: GatewayProviderProps) {
  return <GatewayContext.Provider value={value}>{children}</GatewayContext.Provider>
}

export function useGateway() {
  const value = useContext(GatewayContext)

  if (!value) {
    throw new Error('GatewayContext missing')
  }

  return value
}
