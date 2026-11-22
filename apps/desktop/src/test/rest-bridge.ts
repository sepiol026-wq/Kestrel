// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { vi } from 'vitest'

import type { HermesApiRequest } from '@/global'

/** Install a fake `window.hermesDesktop.api`, the preload bridge every REST helper sends through. */
export function installRestBridge(answer: (request: HermesApiRequest) => object) {
  const api = vi.fn(async (request: HermesApiRequest) => answer(request))

  Object.defineProperty(window, 'hermesDesktop', { configurable: true, value: { api } })

  return api
}
