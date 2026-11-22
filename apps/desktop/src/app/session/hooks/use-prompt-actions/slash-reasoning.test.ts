// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

import { en } from '@/i18n/en'
import { createClientSessionState } from '@/lib/chat-runtime'

import { useSlashCommand } from './slash'
import type { GatewayRequest } from './utils'

afterEach(cleanup)

it('says a /reasoning level typed while a reply streams applies from the next message', async () => {
  const appendSessionTextMessage = vi.fn()

  const { result } = renderHook(() =>
    useSlashCommand({
      activeSessionIdRef: { current: 'runtime-a' },
      selectedStoredSessionIdRef: { current: 'stored-a' },
      busyRef: { current: true },
      copy: en.desktop,
      createBackendSessionForSend: async () => null,
      getRoutedStoredSessionId: () => 'stored-a',
      getRuntimeIdForStoredSession: () => 'runtime-a',
      requestGateway: vi.fn(async () => ({ status: 'deferred', value: 'high' })) as GatewayRequest,
      resumeStoredSession: vi.fn(),
      updateSessionState: vi.fn((_sid, updater) => updater(createClientSessionState())),
      submitPromptText: vi.fn(async () => true),
      appendSessionTextMessage,
      branchCurrentSession: async () => true,
      handleSkinCommand: () => '',
      handoffSession: async () => ({ ok: true }),
      openMemoryGraph: vi.fn(),
      refreshSessions: async () => undefined,
      startFreshSessionDraft: vi.fn()
    })
  )

  await act(async () => {
    await result.current('/reasoning high')
  })

  expect(appendSessionTextMessage).toHaveBeenCalledWith(
    'runtime-a',
    'system',
    expect.stringContaining('high applies from your next message'),
    'stored-a'
  )
})
