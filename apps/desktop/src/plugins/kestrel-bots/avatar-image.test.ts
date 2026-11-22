// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it, vi } from 'vitest'

const { request } = vi.hoisted(() => ({ request: vi.fn() }))

vi.mock('@hermes/plugin-sdk', async () => {
  const { atom } = await import('nanostores')

  return { atom, host: { request } }
})

vi.mock('./shared', () => ({ getPluginCtx: () => null, ID: 'hermes-bots' }))

import { generateAvatarImage, IMAGE_GENERATE_TIMEOUT_MS } from './avatar-image'

describe('generateAvatarImage (#86161)', () => {
  it('opts the image.generate RPC out of the socket generic 30 s deadline', async () => {
    request.mockResolvedValue({ success: true, image_data: 'data:image/png;base64,AA==' })

    await expect(generateAvatarImage('scout', 'Scout')).resolves.toBe('data:image/png;base64,AA==')

    const [method, , timeoutMs] = request.mock.calls[0] as [string, unknown, number]
    expect(method).toBe('image.generate')
    expect(timeoutMs).toBe(IMAGE_GENERATE_TIMEOUT_MS)
    expect(timeoutMs).toBeGreaterThan(30_000)
  })
})
