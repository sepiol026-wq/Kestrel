// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// @vitest-environment jsdom
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { $terminalFontFamily, setTerminalFontFamilyFromConfig } from './terminal-font'
import { useTerminalFontController } from './use-terminal-font'

describe('useTerminalFontController', () => {
  afterEach(() => setTerminalFontFamilyFromConfig(''))

  it('repaints an already-mounted xterm when the profile font changes', async () => {
    const term = {
      options: { fontFamily: 'fallback' },
      refresh: vi.fn(),
      rows: 18
    }

    const fit = vi.fn()

    const clearTextureAtlas = vi.fn()

    const refs = {
      fitRef: { current: fit },
      termRef: { current: term },
      webglRef: { current: { clearTextureAtlas } }
    }

    const { result } = renderHook(() =>
      useTerminalFontController(refs as unknown as Parameters<typeof useTerminalFontController>[0])
    )

    result.current.mountedRef.current = true
    act(() => $terminalFontFamily.set('MesloLGS NF'))

    await waitFor(() => expect(term.options.fontFamily).toContain('MesloLGS NF'))
    expect(fit).toHaveBeenCalledOnce()
    expect(clearTextureAtlas).toHaveBeenCalledOnce()
    expect(term.refresh).toHaveBeenCalledWith(0, 17)
  })
})
